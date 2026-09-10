# Maintainer instructions

These instructions apply when changing this skill repository, not when running
the skill against someone else's project.

## Shared agent instructions

Keep `SKILL.md` and its mode-required references authoritative for skill execution
across agents. Their workflow requirements are instructions, not optional
background reading. Keep `CLAUDE.md` as an import of this file rather than a
separate rule set. Do not copy private project rules or assessment data here.

When changing output or publication guidance, preserve the single-hub lifecycle
in `SKILL.md` and `references/artifact-views.md`: update the canonical workspace,
append history within it, and do not require full bundles on ordinary refreshes.
Keep all publication examples consistent with that default. Instructions guide
agent behavior; do not claim they constitute a technical block on other tools.

## A commit and push is not a finished release

When committing and pushing skill changes, also cut the appropriate release in
the same handoff unless the user explicitly requests an unreleased change.
Implementation commits may be grouped into one release. Do not report the work
as fully shipped after only pushing commits or creating a local tag.

Follow the release checklist in `README.md` under **Versioning**:

- Fetch remote branches and tags, and check published releases before choosing
  the next semantic version. Never assume the local tag list is current.
- Run `node --test scripts/*.test.mjs` and `git diff --check`. Keep project data,
  customer names, private artifacts and credentials out of this public repo.
- Update relevant documentation and move the shipped changelog entries from
  `Unreleased` into a dated version section.
- Commit, create an annotated `vX.Y.Z` tag on that release commit, and push the
  branch and tag without force. Do not overwrite or move an existing release.
- Publish a non-draft GitHub Release for that exact tag with meaningful notes.
- Verify the remote tag resolves to the intended commit and the published
  release references it. Report the version and any incomplete step honestly.

Keep this policy in maintainer guidance. Ordinary roadmap generation must not
start committing, tagging or publishing releases in a user's project.
