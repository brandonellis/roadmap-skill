import { readFile, realpath, mkdir, copyFile, writeFile, chmod } from 'node:fs/promises';
import { resolve, relative, dirname, isAbsolute, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { canonical, verifyHistory } from './assessment-engine.mjs';

async function safeFile(root, file) {
  if (typeof file !== 'string' || isAbsolute(file) || file.split(/[\\/]/).includes('..')) throw new Error('Manifest paths must stay inside the artifact directory');
  const target = await realpath(resolve(root, file));
  const inside = relative(root, target);
  if (!inside || inside === '..' || inside.startsWith(`..${sep}`) || isAbsolute(inside)) throw new Error('Symlink or path escapes artifact directory');
  return target;
}

export async function verifyArtifact(manifestPath) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const root = await realpath(dirname(resolve(manifestPath)));
  if (manifest.schemaVersion !== 1 || manifest.visibility !== 'private') throw new Error('This verifier only handles explicitly private artifact bundles');
  if (!manifest.assessmentId || !manifest.audience || !Array.isArray(manifest.files) || !manifest.files.length) throw new Error('Manifest needs audience, assessment and allowlisted files');
  if (new Set(manifest.files.map(file => file.path)).size !== manifest.files.length) throw new Error('Duplicate manifest paths');
  const read = async file => readFile(await safeFile(root, file), 'utf8');
  for (const file of manifest.files) {
    const content = await readFile(await safeFile(root, file.path));
    const hash = createHash('sha256').update(content).digest('hex');
    if (file.sha256 !== hash) throw new Error(`Changed or stale bundle file: ${file.path}`);
  }
  for (const file of [manifest.artifactFile, manifest.ledgerFile, manifest.historyLockFile]) {
    if (!manifest.files.some(entry => entry.path === file)) throw new Error('Artifact, ledger and history lock must be allowlisted');
  }
  const ledger = JSON.parse(await read(manifest.ledgerFile));
  const history = JSON.parse(await read(manifest.historyLockFile));
  verifyHistory(history, ledger);
  if (manifest.assessmentId !== ledger.currentAssessmentId) throw new Error('Manifest and ledger disagree on current assessment');
  if (!ledger.assessments.some(assessment => assessment.id === manifest.assessmentId)) throw new Error('Current assessment is missing from history');
  const html = await read(manifest.artifactFile);
  const embedded = html.match(/<script\b(?=[^>]*\bid="roadmap-history")(?=[^>]*\btype="application\/json")[^>]*>([\s\S]*?)<\/script>/);
  if (!embedded || canonical(JSON.parse(embedded[1])) !== canonical(ledger)) throw new Error('Visible artifact and saved ledger are different revisions');
  if (ledger.presentation?.artifactBrief?.audience !== manifest.audience) throw new Error('Creation-time audience changed during publication');
  return { root, manifest, verifiedFiles: manifest.files.length };
}

export async function stagePrivateBundle(manifestPath, destination) {
  const result = await verifyArtifact(manifestPath);
  if (result.manifest.files.some(file => file.path === 'publication-manifest.json')) throw new Error('Publication manifest cannot include itself');
  const output = resolve(destination);
  await mkdir(output, { mode: 0o700 });
  for (const file of result.manifest.files) {
    const target = resolve(output, file.path);
    await mkdir(dirname(target), { recursive: true, mode: 0o700 });
    await copyFile(await safeFile(result.root, file.path), target);
    await chmod(target, 0o600);
  }
  const targetManifest = resolve(output, 'publication-manifest.json');
  await writeFile(targetManifest, JSON.stringify(result.manifest, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
  await verifyArtifact(targetManifest);
  return { directory: output, assessmentId: result.manifest.assessmentId, uploaded: false, visibility: 'private' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [manifestPath, option, destination] = process.argv.slice(2);
    if (!manifestPath || (option && (option !== '--private-bundle' || !destination)) || process.argv.length > 5) throw new Error('Usage: node verify-artifact.mjs MANIFEST [--private-bundle NEW_DIRECTORY]');
    const result = option ? await stagePrivateBundle(manifestPath, destination) : await verifyArtifact(manifestPath);
    console.log(JSON.stringify(option ? result : { verifiedFiles: result.verifiedFiles, assessmentId: result.manifest.assessmentId }, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
