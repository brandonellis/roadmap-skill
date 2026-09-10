// Regenerates the "## Contents" block in every long reference file.
//
// A reference over this length is often previewed rather than read whole, so
// its section list has to be visible in the first few lines. Generated rather
// than hand-kept, because a table of contents that drifts from its headings is
// worse than none: it tells the reader a section exists under a name that no
// longer matches, and nothing about reading the file reveals the lie.
// `reference-contents.test.mjs` holds the two in step.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CONTENTS_REQUIRED_ABOVE_LINES = 100;
export const referencesDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'references');

export const sectionsOf = source => [...source.matchAll(/^## (.+)$/gm)].map(match => match[1].trim()).filter(heading => heading !== 'Contents');
// The `m` flag makes `$` a line end, so an end-of-block lookahead written with
// it matches immediately and reports every Contents block as empty. Match the
// next section heading, or the end of the file when Contents is last.
export const contentsOf = source => {
  const block = source.match(/\n## Contents\n([\s\S]*?)\n## /) ?? source.match(/\n## Contents\n([\s\S]*)$/);
  return block ? [...block[1].matchAll(/^- (.+)$/gm)].map(match => match[1].trim()) : null;
};
export const needsContents = source => source.split('\n').length > CONTENTS_REQUIRED_ABOVE_LINES;

// The lead paragraph under the title says when to load the file, which is what
// a reader needs before a section list. So the block goes after it, not above.
export function withContents(source) {
  const sections = sectionsOf(source);
  if (!needsContents(source) || sections.length === 0) return source;
  const block = `## Contents\n\n${sections.map(section => `- ${section}`).join('\n')}\n`;
  const existing = source.match(/## Contents\n[\s\S]*?(?=\n## )/) ?? source.match(/## Contents\n[\s\S]*$/);
  if (existing) return source.replace(existing[0], block.trimEnd() + '\n');
  const firstSection = source.search(/^## /m);
  if (firstSection === -1) return source;
  return `${source.slice(0, firstSection)}${block}\n${source.slice(firstSection)}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const changed = [];
  for (const name of readdirSync(referencesDirectory).filter(file => file.endsWith('.md'))) {
    const path = join(referencesDirectory, name);
    const source = readFileSync(path, 'utf8');
    const next = withContents(source);
    if (next !== source) { writeFileSync(path, next); changed.push(name); }
  }
  console.log(JSON.stringify({ changed, unchanged: readdirSync(referencesDirectory).filter(file => file.endsWith('.md')).length - changed.length }, null, 2));
}
