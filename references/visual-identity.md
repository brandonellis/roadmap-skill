# Visual identity: load what you name, inherit what exists

Read before writing any artifact. Two failures this file exists to stop, both of
which produce a page that looks unconsidered while claiming a deliberate design:

1. Naming a typeface the page never loads, so every declaration silently falls
   back to the OS UI font.
2. Inventing a palette for a project that already has one, so the same project
   looks different in every session.

## Load the fonts you name

The shipped CSS in `assets/` names `"Barlow Condensed"` and `"JetBrains Mono"`.
**Those are not present in a browser by default.** A `font-family` naming them
resolves to the fallback unless the page loads them, and the failure is silent:
nothing errors, the text just renders in the system sans and the whole
readiness register the skill is built around disappears.

Google Fonts is the one font host the Artifact CSP admits. Put this in the page,
before the styles that use it:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap">
```

Swap the families for the project's own when it has them, and keep the shape.
Every stack still ends in a real fallback, because a font host can fail.

Do not assume the CSP blocks font CDNs. It does not block Google Fonts, and a
page that states otherwise in its own design record is wrong and will keep the
mistake alive across every later run. Verify by looking at the rendered page
rather than by repeating what a previous artifact's comment claimed.

A self-hosted face must be inlined as a `@font-face` data URI. Any other host is
blocked, silently, exactly like a missing family.

## Inherit the project's design system before inventing one

**The project's own tokens outrank this skill's defaults.** Before choosing any
colour or typeface, look for an existing system and use it:

- a theme or tokens module (`theme/`, `tokens/`, `palette.*`, `design-system/`)
- the framework theme seed (an Ant Design `colorPrimary`, a Tailwind config, a
  CSS custom-property block)
- the marketing site's stylesheet, which usually carries the public brand
- `CLAUDE.md`, `AGENTS.md` or a brand note naming approved colours

Search for the named constants rather than for hex codes in general: a brand
palette is usually a short list of named exports, and its names (`primary`,
`charcoal`, `sunriseGold`) are the vocabulary to reuse in the artifact.

When one exists, the artifact wears it. Map the skill's shell tokens onto it
rather than importing a second palette, so the page has one visual world:

```css
.roadmap-shell{
  --rm-ink: var(--brand-ink); --rm-rule: var(--brand-rule);
  --rm-link: var(--brand-primary); --rm-focus: var(--brand-primary);
}
```

Grade hue is the one exception that stays semantic: A greens, B blues, C ambers,
D and F reds, inside labelled grade chips only. A brand accent that collides with
a grade tier is a reason to keep the grade scale separate, not to recolour it.

## Record the brand once, inherit it every run

The point of a **BRAND CONTRACT** is that the second run does not redecide. Record
it in the page's DIRECTION CONTRACT comment and in project memory, together:

```text
BRAND CONTRACT (source of truth: <path to the tokens file>, read <date>)
  Display  <family>, loaded from <host>
  Body     <family>
  Mono     <family>
  Ink      <hex>   Ground <hex>   Rule <hex>
  Primary  <hex> <name>   Secondary <hex> <name>
  Accents  <hex> <name>, <hex> <name>
  Grade scale stays semantic and separate from these.
```

Later runs read that block and apply it. They do not run a fresh design pass, do
not propose alternative directions, and do not rename the world. A project whose
artifacts look different every session has a missing brand contract, not a taste
problem.

**Only invent a visual world when the project genuinely has no design system**,
and then record what you invented in the same block so the next run inherits it.
The skill's own default, when nothing exists to inherit, is the readiness
register in `SKILL.md`: condensed grotesque caps display, workhorse grotesque
body, mono tokens. State that you used the default rather than implying the
project chose it.

The user's own words outrank all of the above, including a request for a look
this file would otherwise steer away from.
