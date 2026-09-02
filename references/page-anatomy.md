# Page anatomy — the "readiness board" roadmap pattern

Proven on shipped roadmap pages (Sep 2026). This is the structural spine;
palette/type/voice get a fresh design pass per project.

Order on the page, top to bottom:

1. **Masthead** — big condensed title, a mono kicker carrying the verification
   stamp (`<project> · product + technical roadmap · ticket state verified <ISO ts>`),
   and a lede that names the sources and the long-term destination in one breath.

2. **Status console** — an inverted (dark) strip of 4–6 cells with REAL counts:
   last-reviewed date, items on review, by-horizon split (e.g. `8 now 9 next 5 later`),
   standing risks, closed-since-last-review. Every number re-derived from the
   finished document. This is the "counts before prose" discipline: the page can be
   audited in five seconds before a word is read.

3. **Posture/gate band** (optional) — one amber strip stating the single most
   important standing condition (e.g. "Launch posture · HOLD" + one paragraph).
   Only if the project genuinely has one; an invented gate is noise.

4. **Thesis strip** — three cells, one per horizon, each a bolded one-sentence
   thesis plus two lines of plain prose. This is the executive summary.

5. **Cost-of-delay strip** (only on WSJF-scored pages) — one band listing the
   top 3–5 scored themes by WSJF across all horizons, fixed-date items first
   with a cliff marker, each linking to its detail card; a small footer line
   `N of M themes scored · confirmed <date>`. Renders only from a confirmed
   scoring source (see `wsjf.md`). Scores rank, they never place — an item's
   horizon still comes from what the sources state.

6. **The board** — streams × horizons grid. Rows are streams (2–4), columns are
   the horizons. Cells hold pill links that jump to detail cards. Pill fill color =
   throughline; column = horizon; color NEVER encodes time. Above it, the
   throughline key strip (which the interaction layer turns into the filter).

7. **Throughlines table** — the same items read the other way: one row per
   throughline (T1…Tn), columns are horizons, the row header carries the line's
   name and one-line arc. Call out what this view makes visible (e.g. "the line
   the customer sees has nothing in flight") in a note below. An empty cell shows
   a dashed "nothing in flight" token — absence is information.

8. **Critical-path figure** — inline SVG, three horizon bands, nodes for the
   8–12 load-bearing items, labeled edges. Only edges the sources state out loud.
   Distinguish gates (dashed) from data flows (solid). One hero node (the named
   next feature) gets the accent treatment.

9. **Per-horizon detail sections** — Now, Next, Later. Each: section header with
   the horizon dot + a short italic window note, a sub-paragraph, then a 2-col grid
   of cards. Card = throughline-tinted header (title + throughline code + an
   audience chip like Product/Technical/Both), a "why" paragraph (the plain-language
   case, with bolded key phrases), and a numbered list of concrete items with
   ticket refs as small mono tags. Wide cards (`span2`) for the 1–2 biggest items
   per horizon. An item whose only evidence is anecdotal (transcript, chat,
   notes — no record-tier source backs it) carries a small mono chip naming that
   (`per transcript`, `per notes`), same register as the ticket refs. On scored
   pages a `wsjf N.N` chip joins the same register, and scored cards sort by
   score within their horizon (unscored keep their order below).

10. **Out of scope** — rows of {what, reason, decision date}. Exists so decisions
    are not re-litigated; "each is reversible, but reopening one should start from
    the reason it was closed."

11. **Architecture figure** (optional) — if the project has a canonical systems
    story worth recording (e.g. a canonical learning-loops model), draw it once "for the
    record" in the same SVG style, with a card per element below it.

12. **Standing risks** — amber-bordered list, {mono tag, prose}. Cross-cutting
    patterns only. Framing rule (user-set, firm): risks are *deliberate discipline
    plus a specific gap*, never negligence. Where detection worked, say so.

13. **Where the sources disagree** (only when conflicts exist) — a short list of
    {claim, what the record says, what the anecdote says, which the page went
    with}. The record-tier source decides the board; this block is where the
    other answer survives instead of being silently blended away. Omit it when
    empty, same rule as the posture band. For readers who already know the
    project this is often the page's highest-value content: the overview tells
    them nothing new, the disagreements do.

14. **Footer** — sources with dates and their confirmed authority tier (record
    vs anecdote); any record-tier source the page could not read, named as a
    gap; how to read the ref tags ("everything load-bearing is in the plain
    text"); a confidence note separating what the team stated from what this
    page synthesized; links to companion artifacts.

15. **Fixed back-to-board button** bottom-right; the filter clear-chip stacks
    above it when a filter is active.

## Register rules

- Prose is written for a non-technical reader; engineering detail lives behind
  the ref tags. Never let a ticket id be the only description of anything.
- Bold is for the load-bearing phrase in a sentence, not decoration.
- Each card's "why" answers "why does a customer/the business care", not "what
  does the code do".
- Numbers in the console and section badges must agree with each other and with
  the body; if an item sits on two throughlines, footnote the double-count where
  it shows.
- A score chip renders only from a confirmed scoring source; the page never
  proposes a score.
