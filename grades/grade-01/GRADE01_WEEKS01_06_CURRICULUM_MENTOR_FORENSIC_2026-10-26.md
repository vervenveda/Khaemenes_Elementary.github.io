# Khaemenes Academy · Grade 1 Weeks 01–06 — Curriculum/Mentor Forensic Pass
Date: 2026-10-26 (America/New_York)
Canonical repository: `vervenveda/Khaemenes_Elementary.github.io`
Branch: `main`

## Purpose and preservation boundaries
Improve the student's actual lessons, objective-aligned Mentor context, authored subject practice, and formal assessment quality while preserving the 36-week grading authority, quizzes/retake tracking, saved student work, established page templates and CSS. This pass did not modify grades 02–05 lesson metadata, any course-grade values, or any private teacher marking keys.

## Exact source-of-truth diagnosis
The active Grade 1 lesson and quiz pages load `grades/grade-01/data/curriculum.js` into `KHAEMENES_GRADE01_CURRICULUM`; the active `grades/grade-01/assets/grade1-mastery.js` renderer uses that same data.

By contrast, `assets/khaemenes-elementary-focus-map.js` described a different Grade 1 sequence (drawn from a secondary curriculum metadata snapshot). In a 36-week side-by-side comparison, *35 of 36* Grade 01 entries did not match the titles of the actual learner-facing weeks. For example, actual Week 05 "Families, Communities, and Teen Numbers" had been labeled "Plants, Seeds, and Living Things" in the focus map. This could misdirect curriculum-specific Mentor guidance and question selection.

### Repair 1 — Canonical 36-week focus map
Rebuilt Grade 01's 36 entries from the actual lesson-loaded `title`, `essentialQuestion`, `literacy`, `math`, `inquiry`, `sel` and `project`. Grades 02–05 map sections unchanged.
Commit: `7b66b04942f64147c32a983b863f6e01ec165241`.

### Repair 2 — Daily lesson depth, Weeks 02–06
Preserved all 36 weeks and every existing authored quiz at the moment of this specific change. Added to 25 original daily lesson objects: instructional skill, explicit model, worked example, guided and independent practice, stretch task, student product, check for understanding, saved-work evidence criterion, support, extension, reflection, and learning-time guidance. The existing Grade 1 renderer automatically displays these fields and does not require a new JavaScript or CSS layer. Week 01's previously authored in-depth content remains preserved.
Commit: `85f3a7c6bfd147ab018a1f10d8317a5db52d98ad`.

### Repair 3 — Companion alignment, Weeks 01–06
The optional instruction companion had additional mismatched topical headings and examples. Rebuilt its six *existing* sections from the live lesson metadata, using original daily models, independent tasks and evidence prompts. Kept the same route, stylesheet, IDs, buttons, printable behavior and links to official lessons. It remains advisory and formative-only.
Commit: `089b654d9675c29e0b7e3e8a3295c8f3dac135d6`.

### Repair 4 — 60 unique subject-aligned authored mastery questions
Before repair, the first six weekly authored 10-question banks had just **15 unique prompt texts among 60 authored items**; nine generic stems repeated across every week. Replaced those 60 items with 60 independently authored, age-appropriate Grade 1 questions covering the actual focus: Weeks 1–2 baseline classroom skills, listening, consonant sounds and counting to 20; Week 3 short a/e and joining numbers within 10; Week 4 short i/o/u, subtraction and before/after observations; Week 5 ten-and-ones and community explanation; Week 6 weather observations, tallies, labeled graph interpretation and safety. Each question retains four distinct options, one valid key and the original `type:"mc"` schema.
Historical attempts and the 80% passing standard are not rewritten. The 300 authored questions in Weeks 07–36 remain for a later separate instructional review.
Commit: `15652d23d352d15152d22b50f07e00e04c39ff42`.

### Repair 5 — Correct **delivered** Grade 01 Monte Carlo mix
The factory used to seed six authored items into a ~32-question candidate pool, reshuffle the entire pool, and deliver only 12; therefore very few authored items were guaranteed to reach a student's official weekly attempt. Revised only the Grade 01 weekly branch of the **existing factory**, so the 32 candidate pool is retained, with **8 randomly drawn released lesson-specific questions plus 4 integrated items** in its first 12 delivered questions; all question options are still shuffled, and retakes redraw.
Other Elementary grades and the Grade 01 midterm/final branch remain on the previous blueprint. 180 seeded Grade 01 attempts (30 seeds for six weeks) passed 8/4 ratio, 12 distinct delivered prompts, 32 candidate count, correct answer positions, and schema validation. Grades 02–05 bank validity was also rechecked.
Commit: `74f5d0d78b011c49ecd3b9c86986b605163f22f9`.

## Permanent regression checks
- `tools/validate-grade01-mentor-focus.mjs` guards all 36 active curriculum ↔ mentor-context mappings; daily richness of Weeks 02–06; the six-week companion; 60 unique authored prompts; four-option answer validity; and 96 additional seeded 8/4 student form checks.
- Registered in the existing `.github/workflows/elementary-experience-regression.yml` without introducing a competing workflow or grader.
- An intermediate run failed for a validator-only artificial 30-character minimum that incorrectly rejected the sensible question "What is one more than 18?" The test was corrected to permit concise child-friendly questions while enforcing answer integrity, uniqueness and alignment.
- The existing Elementary Learning Engine Regression and rollout succeeded at `74f5d0d78b`. The expanded experience regression must be verified on the final branch head before claiming final certification.

## Remaining audit boundaries
1. Grade 01 Weeks 07–36 have 300 authored questions but only 39 unique prompt texts (as inspected after the Week 01–06 repairs), so the next released content phase should be Weeks 07–12 with matching daily depth and question quality.
2. A matching local family-registry learner is NOT the same thing as cryptographically authenticated educator permission. Do not grant student access to teacher-only keys or call a local portfolio checkbox an authenticated review.
3. A learner-context unit test is not a substitute for full browser testing of: starting a quiz; switching active fictional learners; final score; reload; handwriting or typed evidence; print; Archaemenes remediation; mobile keyboard and 255px viewport.
4. Legacy `grades/grade-01/data/course-data.json` remains a separate source snapshot. Do not purge until all readers and import/export dependencies are identified.
5. Grade 02–05 content is outside this specific surgical pass and remains pending a comparable subject-by-subject deep review.

## Authority contract unchanged
Main only. Keep the Academy Family Registry as placement authority, first-party formal assessment engine as grade authority, Archaemenes as a learning support, approved educator marking guides in their authorized teacher workflow, and the 80% mastery threshold. Do not layer new graders, styles or conflicting chat controllers.
