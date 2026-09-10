import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, symlink, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { sealHistory } from './assessment-engine.mjs';
import { verifyArtifact, stagePrivateBundle } from './verify-artifact.mjs';
import { renderOutcomeStory, renderNextChecks, renderDeliveryMilestones } from './render-progress.mjs';

async function fixture(context) {
  const root = await mkdtemp(join(tmpdir(), 'roadmap-bundle-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  const ledger = { originalBaselineId: 'initial', originalBaseline: { grade: 'B+' }, currentAssessmentId: 'first', assessments: [{ id: 'first', grade: 'B+' }], presentation: { artifactBrief: { audience: 'Private reviewers' } } };
  const files = {
    'ledger.json': JSON.stringify(ledger),
    'history.json': JSON.stringify(sealHistory(ledger)),
    'index.html': `<html><script type="application/json" id="roadmap-history">${JSON.stringify(ledger)}</script></html>`,
  };
  for (const [name, content] of Object.entries(files)) await writeFile(join(root, name), content);
  const manifest = { schemaVersion: 1, visibility: 'private', audience: 'Private reviewers', assessmentId: 'first', artifactFile: 'index.html', ledgerFile: 'ledger.json', historyLockFile: 'history.json', files: Object.entries(files).map(([path, content]) => ({ path, sha256: createHash('sha256').update(content).digest('hex') })) };
  const path = join(root, 'publication-manifest.json');
  const save = () => writeFile(path, JSON.stringify(manifest));
  await save();
  return { root, ledger, files, manifest, path, save };
}

test('verified private bundle copies only the allowlist and reports no upload', async context => {
  const data = await fixture(context);
  await writeFile(join(data.root, 'do-not-share.txt'), 'not allowlisted');
  assert.equal((await verifyArtifact(data.path)).verifiedFiles, 3);
  const target = join(data.root, 'bundle');
  const result = await stagePrivateBundle(data.path, target);
  assert.equal(result.uploaded, false);
  await assert.rejects(readFile(join(target, 'do-not-share.txt')), /ENOENT/);
  assert.equal((await stat(target)).mode & 0o777, 0o700);
  assert.equal((await stat(join(target, 'index.html'))).mode & 0o777, 0o600);
  await assert.rejects(stagePrivateBundle(data.path, target), /EEXIST/);
});

test('file tampering, publication scope changes and stale manifest fail closed', async context => {
  const data = await fixture(context);
  data.manifest.visibility = 'public'; await data.save();
  await assert.rejects(verifyArtifact(data.path), /explicitly private/);
  data.manifest.visibility = 'private'; data.manifest.assessmentId = 'different'; await data.save();
  await assert.rejects(verifyArtifact(data.path), /disagree/);
  data.manifest.assessmentId = 'first'; await data.save();
  await writeFile(join(data.root, 'index.html'), 'changed');
  await assert.rejects(verifyArtifact(data.path), /Changed or stale/);
});

test('a freshly hashed HTML file cannot hide a different embedded assessment', async context => {
  const data = await fixture(context);
  const html = data.files['index.html'].replace('"currentAssessmentId":"first"', '"currentAssessmentId":"other"');
  await writeFile(join(data.root, 'index.html'), html);
  data.manifest.files.find(file => file.path === 'index.html').sha256 = createHash('sha256').update(html).digest('hex');
  await data.save();
  await assert.rejects(verifyArtifact(data.path), /different revisions/);
});

test('a reassessment appends history and updates both ledger and embedded current identity', async context => {
  const data = await fixture(context);
  const history = await readFile(join(data.root, 'history.json'), 'utf8');
  data.ledger.assessments.push({ id: 'second', grade: 'A-' });
  data.ledger.currentAssessmentId = 'second';
  data.manifest.assessmentId = 'second';
  const update = async (file, content) => {
    await writeFile(join(data.root, file), content);
    data.manifest.files.find(entry => entry.path === file).sha256 = createHash('sha256').update(content).digest('hex');
    await data.save();
  };
  await update('ledger.json', JSON.stringify(data.ledger));
  await assert.rejects(verifyArtifact(data.path), /different revisions/);
  await update('index.html', `<html><script type="application/json" id="roadmap-history">${JSON.stringify(data.ledger)}</script></html>`);
  assert.equal((await verifyArtifact(data.path)).manifest.assessmentId, 'second');
  assert.equal(await readFile(join(data.root, 'history.json'), 'utf8'), history);
  assert.equal(data.ledger.originalBaselineId, 'initial');
  assert.deepEqual(data.ledger.assessments[0], { id: 'first', grade: 'B+' });
});

test('creation-time audience cannot change silently', async context => {
  const data = await fixture(context); data.manifest.audience = 'Public investors'; await data.save();
  await assert.rejects(verifyArtifact(data.path), /audience changed/);
});

test('a registered scale lens cannot disappear during component-only regeneration', async context => {
  const data = await fixture(context);
  data.ledger.assessmentLenses = [{ id: 'scalability', sourceFile: 'scale.json' }];
  const source = JSON.stringify({ id: 'scalability', lastAssessedOn: '2026-01-01' });
  await writeFile(join(data.root, 'scale.json'), source);
  data.manifest.files.push({ path: 'scale.json', sha256: createHash('sha256').update(source).digest('hex') });
  const update = async (file, content) => {
    await writeFile(join(data.root, file), content);
    data.manifest.files.find(entry => entry.path === file).sha256 = createHash('sha256').update(content).digest('hex');
    await data.save();
  };
  await update('ledger.json', JSON.stringify(data.ledger));
  const history = `<script type="application/json" id="roadmap-history">${JSON.stringify(data.ledger)}</script>`;
  await update('index.html', `<html>${history}</html>`);
  await assert.rejects(verifyArtifact(data.path), /Standing assessment lens missing/);
  await update('index.html', `<html>${history}<section data-assessment-lens="scalability">Dated scale grade</section></html>`);
  assert.equal((await verifyArtifact(data.path)).verifiedFiles, 4);
  data.manifest.files = data.manifest.files.filter(file => file.path !== 'scale.json');
  await data.save();
  await assert.rejects(verifyArtifact(data.path), /evidence must be allowlisted/);
});

test('path traversal and symlink escapes cannot add files to a bundle', async context => {
  const data = await fixture(context);
  data.manifest.files.push({ path: '../outside', sha256: 'unused' }); await data.save();
  await assert.rejects(verifyArtifact(data.path), /inside the artifact/);
  data.manifest.files.pop();
  await symlink('/etc/hosts', join(data.root, 'outside'));
  data.manifest.files.push({ path: 'outside', sha256: 'unused' }); await data.save();
  await assert.rejects(verifyArtifact(data.path), /escapes artifact/);
});

test('outcome renderer escapes content, requires proof and rejects script links', () => {
  const story = { baselineId: 'initial', assessmentId: 'current', observedAt: '2026-01-01T00:00:00Z', heading: 'Verified outcomes', summary: 'Meaningful progress', observationLabel: 'Evidence', evidenceHref: '#evidence', sincePreviousLabel: 'Unavailable', wins: [{ id: 'win', title: '<script>bad</script>', outcome: 'A real outcome', proofLabel: 'Observed', scopeLabel: 'Staging', evidenceHref: '#evidence' }] };
  assert.match(renderOutcomeStory(story), /&lt;script&gt;/);
  story.wins[0].evidenceHref = 'javascript:alert(1)'; assert.throws(() => renderOutcomeStory(story), /Unsafe evidence/);
  story.wins[0].evidenceHref = ''; assert.throws(() => renderOutcomeStory(story), /proof and scope/);
});

test('next checks disclose owner, acceptance and environment with native details', () => {
  const components = [{ id: 'component', name: 'Component', grade: 'B', nextOutcome: 'Safer operation', auditHref: '#audit', actions: [{ title: 'Exercise recovery', acceptance: 'Prove restored data matches the backup', owner: 'Unassigned', scope: 'Staging first', status: 'Proposed', evidenceHref: '#evidence' }] }];
  const html = renderNextChecks(components);
  assert.match(html, /<details[^>]+id="next-component"/);
  assert.match(html, /Unassigned · Staging first/);
  assert.doesNotMatch(html, /<details[^>]+\bopen\b/);
  delete components[0].actions[0].owner; assert.throws(() => renderNextChecks(components), /need acceptance, owner/);
});

test('milestone renderer retains unscheduled commitments and observation labels', () => {
  const html = renderDeliveryMilestones([{ title: 'Reliable releases', plannedLabel: 'No committed date', observedLabel: 'Observed January 2', scopeLabel: 'Production', stateLabel: 'Verified', evidenceHref: '#evidence' }]);
  assert.match(html, /No committed date/); assert.match(html, /Observed January 2/);
  assert.match(html, /not an invented completion date/);
});
