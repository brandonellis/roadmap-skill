import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENTS_REQUIRED_ABOVE_LINES, referencesDirectory, sectionsOf, contentsOf, needsContents, withContents } from './build-reference-contents.mjs';

const references = readdirSync(referencesDirectory).filter(file => file.endsWith('.md'))
  .map(name => ({ name, source: readFileSync(join(referencesDirectory, name), 'utf8') }));

test('every long reference lists its sections where a partial read can see them', () => {
  const long = references.filter(reference => needsContents(reference.source));
  assert.ok(long.length > 0, 'no long references found; the guard would pass vacuously');
  for (const reference of long) {
    const contents = contentsOf(reference.source);
    assert.ok(contents, `${reference.name} is over ${CONTENTS_REQUIRED_ABOVE_LINES} lines with no Contents block`);
    assert.deepEqual(contents, sectionsOf(reference.source), `${reference.name}: Contents and headings disagree. Run node scripts/build-reference-contents.mjs`);
  }
});

test('the Contents block sits under the lead paragraph, not above it', () => {
  for (const reference of references.filter(reference => contentsOf(reference.source))) {
    const lines = reference.source.split('\n');
    const title = lines.findIndex(line => line.startsWith('# '));
    const contents = lines.findIndex(line => line === '## Contents');
    assert.ok(contents > title + 1, `${reference.name}: Contents displaces the lead paragraph that says when to load the file`);
    assert.equal(lines.slice(0, contents).filter(line => line.startsWith('## ')).length, 0, `${reference.name}: Contents must precede the first section`);
  }
});

test('a short reference is left alone, and a new section reddens the build', () => {
  const short = '# Short\n\nLead.\n\n## One\n\nBody.\n';
  assert.equal(withContents(short), short);

  const long = `# Long\n\nLead.\n\n${['One', 'Two'].map(section => `## ${section}\n\n${'Body line.\n'.repeat(60)}`).join('\n')}`;
  const built = withContents(long);
  assert.deepEqual(contentsOf(built), ['One', 'Two']);
  assert.notDeepEqual(contentsOf(built), sectionsOf(`${built}\n## Three\n`), 'adding a section must break the equality this guard asserts');
  assert.equal(withContents(built), built, 'regeneration is idempotent');
});
