import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const evals = join(root, 'evals');
const scenarios = readdirSync(evals).filter(name => name.endsWith('.eval.json'))
  .map(name => ({ name, ...JSON.parse(readFileSync(join(evals, name), 'utf8')) }));

// The published guidance asks for at least three scenarios. Three is a floor on
// coverage, not a target: below it, one narrow scenario decides whether the
// skill is working.
const MINIMUM_SCENARIOS = 3;

test('the suite meets the minimum and every scenario is uniquely identified', () => {
  assert.ok(scenarios.length >= MINIMUM_SCENARIOS, `${scenarios.length} scenarios, need ${MINIMUM_SCENARIOS}`);
  assert.equal(new Set(scenarios.map(scenario => scenario.id)).size, scenarios.length, 'duplicate scenario id');
  for (const scenario of scenarios) assert.match(scenario.id, /^[a-z][a-z0-9-]*$/, `${scenario.name}: unsafe id`);
});

test('each scenario is runnable: a real query, real files, and checkable expectations', () => {
  for (const scenario of scenarios) {
    assert.deepEqual(scenario.skills, ['roadmap'], `${scenario.name}: names another skill`);
    assert.ok(scenario.query?.trim(), `${scenario.name}: no query`);
    assert.ok(Array.isArray(scenario.files) && scenario.files.length, `${scenario.name}: no files`);
    for (const file of scenario.files) {
      const path = join(evals, file);
      assert.ok(existsSync(path), `${scenario.name}: fixture ${file} does not exist`);
      if (file.endsWith('/')) assert.ok(statSync(path).isDirectory() && readdirSync(path).length, `${scenario.name}: ${file} is empty`);
    }
    assert.ok(scenario.expected_behavior?.length >= 4, `${scenario.name}: fewer than four expectations`);
    for (const line of [...scenario.expected_behavior, ...(scenario.must_not ?? [])]) {
      assert.ok(line.trim().length > 20, `${scenario.name}: "${line}" is too vague to grade`);
      assert.doesNotMatch(line, /\b(handle|properly|correctly|appropriately|as needed|good)\b/i, `${scenario.name}: "${line}" grades on a word with no observable meaning`);
    }
  }
});

// A scenario that passes identically with and without the skill measures the
// model. Naming the gap is what keeps the suite honest about which it tests.
test('every scenario names the failure it exists to catch, and what fails it outright', () => {
  for (const scenario of scenarios) {
    assert.ok(scenario.gap?.trim().length > 40, `${scenario.name}: no gap statement, so a pass proves nothing about the skill`);
    assert.ok(scenario.must_not?.length, `${scenario.name}: no must_not; most of this skill's value is restraint`);
  }
});

test('the suite covers building, updating and NOT building', () => {
  const queries = scenarios.map(scenario => scenario.query.toLowerCase());
  assert.ok(queries.some(query => /build|create/.test(query)), 'no fresh-build scenario');
  assert.ok(queries.some(query => /refresh|update/.test(query)), 'no update scenario');
  assert.ok(scenarios.some(scenario => scenario.must_not.some(line => /publish|four-phase|build/i.test(line)) && /^(what|which|when|who|how|why|is|are|does)\b/i.test(scenario.query)),
    'no scenario where the right answer is prose and no artifact');
});

test('fixtures stay synthetic and carry no project data', () => {
  const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
  const files = walk(join(evals, 'fixtures'));
  assert.ok(files.length >= 4, 'fixture tree is too thin to exercise discovery');
  const corpus = files.map(file => readFileSync(file, 'utf8')).join('\n');
  for (const marker of [/\bWAA-\d+/, /linear\.app/i, /claude\.ai\/code\/artifact/i, /\/Users\//]) {
    assert.doesNotMatch(corpus, marker, `fixture carries project data: ${marker}`);
  }
  assert.match(corpus, /[Ss]ynthetic/, 'fixtures must say they are invented, so a reader never mistakes one for a real project');
});
