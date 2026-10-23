# Khaemenes Elementary · Weeks 08–12 Instructional Depth Pass — 2026-10-23

## Scope
Grades 02–05, Weeks 08–12, non-civic subject halls:
- Language Arts
- Mathematics
- Science
- Arts/Music
- Health/PE/SEL
- Technology/Tools
- Integrated Projects

Total target surfaces: **140**.

## Bubble removed
The full-year audit showed sound structure, assessment, learner isolation, and shared formative tooling, but Weeks 08–12 still relied too heavily on repetitive daily shell language when a page lacked a custom worked studio.

## Repair
The shared Elementary Learning Ledger now detects Weeks 08–12 and layers a topic-aware Instructional Depth Studio using the grade/week focus map.

Every target lesson receives:
- the actual weekly theme;
- a week-specific rigor lens;
- a discipline-specific teacher move;
- a concrete student task;
- a verifiable evidence criterion.

The five-week cognitive progression is:
1. Week 08 — compare, classify, and transfer patterns;
2. Week 09 — measure, represent, and reason from evidence;
3. Week 10 — solve/build through connected steps;
4. Week 11 — precision, structure, vocabulary, and verification;
5. Week 12 — classification, systems, and synthesis.

## Non-regression boundary
This is a **formative instructional layer only**. It does not write formal weekly scores, award mastery, change placement, or unlock curriculum. Academy formal mastery remains 80% and continues to be governed by the verified assessment engine.

## Regression seal
The primary Elementary validator now explicitly audits all 140 Weeks 08–12 target surfaces for:
- focus-map coverage;
- shared depth-engine access;
- depth-band definitions and marker;
- formative-only authority boundary.

Existing full-year structural, assessment, portfolio, learner-isolation, and state-localization checks remain in place.


## Follow-up runtime hardening

A live-main verification pass found one Grade 02 compatibility seam after the depth-band rollout. Grade 02 subject pages encode their concise daily content focus in the lesson heading (for example, `Monday: Operations: one-step word problems`) rather than in the dedicated `Focus:` paragraph used by Grades 03–05.

The shared learning ledger now:
- prefers an explicit `Focus:` paragraph when present;
- otherwise derives the concise content focus from the Grade 02 lesson heading;
- uses the page focus next;
- falls back to the longer objective only after those stronger sources.

The regression validator now additionally requires:
- Grade 02 heading-based focus extraction to remain ahead of the objective fallback;
- all Grade 02 Weeks 08–12 lessons to retain five content-bearing headings;
- the focus map to load before the topic-aware learning ledger on every one of the 140 target surfaces.

Verification result: **PASS** in GitHub Actions run 39908248592. The full Elementary validator, Week 6 instructional-evidence validator, and Grades 01–05 learner-isolation regression all completed successfully.

Functional hardening head: `2b33ffc717ffe8a714ebe6e272b6710f45aec0f9`.
