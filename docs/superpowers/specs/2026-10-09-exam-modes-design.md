# Exam Modes — Design Spec (CertSherpa Practice Engine)

- Date: 2026-10-09 · Status: approved brief, awaiting spec review
- Branch target: `feat/exam-modes` (off `main`)
- Constraints: static-only (GitHub Pages, no backend), solo climbers, Topographic Expedition tokens, MCQ schema unchanged

## 1. Job and audience

Solo certification climbers doing final exam-day preparation. They arrive from Practice picker with a set chosen. Success = sit a realistic timed mock, review every question (including flagged/skipped), drill weak domains, and leave with a per-domain breakdown + pass/fail readiness verdict.

## 2. Outcome and proof

- Timed mock: countdown = question count × 90s, pause stops the clock, 0s auto-submits.
- Review: flag/skip/pause during quiz + summary grid (answered/flagged/skipped/current) + revisit any question before submit.
- Domain drill: start a quiz filtered to one tag-domain (min 5 questions available, else disabled with reason).
- Results: per-domain accuracy derived from question `tags` + overall % + readiness verdict (pass ≥ 80%, same threshold as current "Summit reached").
- Attempt history persisted in localStorage by extending `AttemptStats` (back-compat: old `{attempts,bestScore,lastAttempt}` keys keep working; new optional `history[]` appended, capped at 20 entries).

## 3. Selected direction (approach B)

New pure-logic module `website/src/app/exam/engine.ts` (timer reducer, flag/skip state, per-tag scoring, history serialize — no JSX, unit-testable by hand-run) + thin `PracticePage` wiring. Rejected: (A) stuffing into `PracticePage.tsx` (~300 lines, would bloat); (C) URL-driven session (router complexity, share value low for timed runs).

## 4. Scope and boundaries

In scope: mode picker addition (practice vs timed vs drill), timer bar UI, flag/skip controls, summary grid + revisit, drill tag selector, results breakdown + verdict, history persistence.
Untouched: bank schema/validator, question rendering, Topographic tokens, router (no new routes), ResourcesPage.
Anti-goals: no multi-select/matching items, no SM-2 scheduling (separate bet), no backend/sync, no SEO prerender.

## 5. States and ranges

- Typical 10–50 questions/mock; timer 15–75 min derived. Empty domain (< 5 Qs): drill option disabled with explanation.
- States: idle countdown, running, paused (clock stopped, controls locked except resume), auto-submitted (banner "Time — auto-submitted"), flagged/skipped/current/answered per question, revisit-from-grid, results with per-domain rows (domain, correct/total, bar).
- Edge: tab hidden → clock keeps running (exam-realistic) + note in UI; reload mid-exam → attempt discarded with confirm (no partial resume in v1).

## 6. Interaction and layout

- Sticky exam bar: countdown (tabular numerals, `aria-live` polite at 60s remaining → assertive under 60s), pause/resume, flag current, summary-grid toggle.
- Summary grid: 44px cells, color + icon + label (never color-alone), keyboard reachable, click revisits.
- Drill entry: tag chips with counts from `index.json` tags; min-5 rule enforced with reason text.
- Results: overall % hero (keep current summit-log layout), domain table sorted worst-first (study priority), verdict chip, history line ("Attempt 3 · best 82%").
- Reduced-motion: no tick animation, only discretehia state changes.

## 7. Constraints and open decisions (for builder)

- Static-only: timer via `setInterval` + `Date.now()` deltas (drift-safe); persistence namespaced `certsherpa_{setId}` as today.
- a11y: focus-visible everywhere, 44px targets, live regions as above, contrast 4.5:1 from tokens.
- Builder must not invent: palette/fonts/motion, new routes, schema changes, backend calls.
- Verification: `pnpm validate`, `vite build`, `impeccable detect` on touched files, manual pass at 375/768/1024/1440 + keyboard-only run + pause/resume + auto-submit + back-button behavior.

## Self-review

- Placeholders: none (all numbers decided: 90s, 80%, min-5, cap-20).
- Consistency: timer appears in mock only (§2 vs §6 aligned); history extension back-compat stated twice, same shape.
- Scope: single plan (engine module + page wiring); SM-2/voting/prerender explicitly out.
- Ambiguity: "pause locks controls except resume" explicit; "tab hidden keeps clock" explicit; per-domain derived from `tags` (first tag segment? NO — full tag string grouped, sorted worst-first) explicit.
