import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
const reference = readFileSync(join(root, 'references', 'visual-identity.md'), 'utf8');

const css = readdirSync(assets).filter(name => name.endsWith('.css'))
  .map(name => readFileSync(join(assets, name), 'utf8')).join('\n');

// Families a browser already has. Everything else has to be fetched, and a
// font-family naming an absent face fails silently: the text simply renders in
// the fallback while the page claims a typographic register it never loaded.
const alwaysAvailable = new Set([
  'Segoe UI', 'Helvetica Neue', 'Arial', 'Roboto', 'Menlo', 'Consolas',
  'Liberation Mono', 'SF Mono', 'Courier New', 'Times New Roman', 'Georgia',
]);

const namedFamilies = [...new Set([...css.matchAll(/"([A-Z][A-Za-z0-9 ]+)"/g)].map(m => m[1]))]
  .filter(name => !alwaysAvailable.has(name))
  // quoted strings in CSS selectors and attribute values are not font names
  .filter(name => new RegExp(`font(?:-family)?\\s*:[^;{}]*"${name}"`).test(css));

test('every webfont the shipped CSS names has a documented way to load it', () => {
  assert.ok(namedFamilies.length, 'expected the shipped CSS to name at least one webfont');
  for (const family of namedFamilies) {
    assert.ok(
      reference.includes(family.replace(/ /g, '+')) || reference.includes(family),
      `${family} is named by the shipped CSS but visual-identity.md never says how to load it`,
    );
  }
});

test('the reference gives a real, CSP-permitted font link', () => {
  assert.match(reference, /https:\/\/fonts\.googleapis\.com\/css2\?family=/,
    'the load instruction must be a concrete Google Fonts link, not prose');
  assert.match(reference, /preconnect/, 'preconnect to the font host and its file host');
  assert.match(reference, /display=swap/, 'a blocking font swap hides the page while it loads');
  // A previous artifact recorded "the CSP blocks font CDNs" in its own design
  // record and rendered in the fallback for weeks. The reference has to correct
  // that belief outright, not merely omit it.
  assert.match(reference, /does not block Google Fonts/i,
    'correct the CSP misconception explicitly, or a page will keep inheriting it');
});

test('the brand contract is inheritable, not re-decided per run', () => {
  assert.match(reference, /BRAND CONTRACT/, 'name the block later runs must read');
  assert.match(reference, /DIRECTION CONTRACT/, 'say where it is recorded on the page itself');
  for (const phrase of ['theme', 'tokens', 'colorPrimary']) {
    assert.ok(reference.includes(phrase), `name ${phrase} as a place a project's palette already lives`);
  }
});
