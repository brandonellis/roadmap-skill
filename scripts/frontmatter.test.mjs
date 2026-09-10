import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'SKILL.md'), 'utf8');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const [, frontmatter, ...rest] = source.split('---\n');
const body = rest.join('---\n');
const fields = Object.fromEntries([...frontmatter.matchAll(/^([\w-]+): *(.*)$/gm)].map(match => [match[1], match[2].trim()]));

// Keys the Agent Skills spec accepts. A skill carrying anything else still runs
// in Claude Code, but claude.ai upload and package_skill.py REFUSE it by name.
const SPEC_KEYS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'];
// Claude-Code-only keys this skill deliberately keeps, and what each costs.
// Adding one is a distribution decision, so it is a visible diff here.
const CLAUDE_CODE_ONLY = { 'argument-hint': 'mode autocomplete when the user types /roadmap' };

test('the frontmatter satisfies the published name and description limits', () => {
  assert.ok(source.startsWith('---\n'), 'the opening --- must be the first line or the whole file is treated as body');
  assert.match(fields.name, /^[a-z0-9-]{1,64}$/);
  assert.ok(!/anthropic|claude/i.test(fields.name), 'reserved word in name');
  assert.ok(fields.description.length > 0 && fields.description.length <= 1024, `description is ${fields.description.length} characters`);
  // The no-XML rule is stated for name and description; argument-hint carries
  // angle-bracket placeholders on purpose and is not covered by it.
  for (const key of ['name', 'description']) assert.ok(!/<[^>]+>/.test(fields[key]), `${key} cannot contain XML tags`);
});

test('the description says what it does and when to use it, in third person', () => {
  assert.doesNotMatch(fields.description, /\b(I can|I will|you can use this|we )\b/i, 'descriptions are injected into the system prompt and must stay third person');
  assert.match(fields.description, /\bUse for\b|\bUse when\b/, 'no trigger clause, so selection has only the capability half');
  for (const mode of ['refresh', 'gantt', 'wsjf', 'grade', 'score']) {
    assert.ok(new RegExp(mode, 'i').test(fields.description) || new RegExp(mode, 'i').test(fields['argument-hint'] ?? ''), `mode ${mode} is undiscoverable from metadata`);
  }
});

test('every non-spec frontmatter key is declared, with its distribution cost written down', () => {
  const extra = Object.keys(fields).filter(key => !SPEC_KEYS.includes(key));
  assert.deepEqual(extra.sort(), Object.keys(CLAUDE_CODE_ONLY).sort(), 'an undeclared key would break claude.ai upload and package_skill.py silently until someone tried it');
  for (const key of extra) {
    assert.ok(CLAUDE_CODE_ONLY[key], `${key} has no recorded reason`);
    assert.ok(readme.includes(key), `README must tell an importer that ${key} has to be removed before packaging`);
  }
});

test('the body stays inside the 500-line budget', () => {
  const lines = body.split('\n').length - 1;
  assert.ok(lines < 500, `SKILL.md body is ${lines} lines; split content into references/ before adding more`);
});
