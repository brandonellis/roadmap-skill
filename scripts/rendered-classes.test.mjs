import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const assets = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const css = readdirSync(assets).filter(name => name.endsWith('.css'))
  .map(name => readFileSync(join(assets, name), 'utf8')).join('\n');

// Declarations inside a media query only refine a rule that must already exist.
// A class whose ONLY declarations are media-scoped renders unstyled at every
// other width, which is how the grade tiles shipped as an inline run of links.
const outsideMediaQueries = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\}\s*)*\}/g, '');

const layoutOwners = [
  ['rm-grade-grid', /display:\s*grid/],
  ['rm-grade-tile', /display:\s*flex/],
  ['rm-grade-movement', /display:\s*grid/],
  ['rm-cohort-cells', /display:\s*grid/],
  ['rm-finding-segments', /display:\s*flex/],
];

test('every class that owns a layout declares it outside a media query', () => {
  for (const [className, declaration] of layoutOwners) {
    const rules = [...outsideMediaQueries.matchAll(new RegExp(`\\.${className}\\b[^{}]*\\{([^{}]*)\\}`, 'g'))]
      .map(match => match[1]).join(' ');
    assert.ok(rules, `${className} has no base rule outside a media query`);
    assert.match(rules, declaration, `${className} never declares its own layout`);
  }
});

test('a lens tile is marked and spans its own track', () => {
  const lens = [...outsideMediaQueries.matchAll(/\.rm-grade-tile\[data-grade-scope="lens"\][^{}]*\{([^{}]*)\}/g)].map(match => match[1]).join(' ');
  assert.ok(lens, 'lens tiles have no base rule, so they render as ordinary components');
  assert.match(lens, /grid-column:\s*span/, 'a lens tile must claim its own track or it reads as the ninth component');
  const badge = [...outsideMediaQueries.matchAll(/\.rm-grade-tile\s+small\b[^{}]*\{([^{}]*)\}/g)].map(match => match[1]).join(' ');
  assert.ok(badge, 'the lens marker has no style, so the word "lens" reads as part of the name');
});

test('a grade tile is a real link surface, not bare text', () => {
  const tile = [...outsideMediaQueries.matchAll(/\.rm-grade-tile\b[^{}]*\{([^{}]*)\}/g)].map(match => match[1]).join(' ');
  assert.match(tile, /text-decoration:\s*none/, 'tiles are anchors and must drop the default underline');
  assert.match(tile, /min-width:\s*0/, 'a grid child needs min-width:0 or long component names blow out the track');
});
