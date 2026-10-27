# Grade 1 · Weeks 01–06 · Five-Bubble Curriculum & Logic Reaudit
Date: 2026-10-27
Branch: main
Repo: vervenveda/Khaemenes_Elementary.github.io
Source-of-truth: grades/grade-01/data/curriculum.js
Scope: Existing Grade 1 lesson renderer, original formal scorer compatibility, learner-scoped daily work, printables, pen canvas and assessment gate routing.

## Baseline
The canonical Grade 1 teaching sequence and 36-week Mentor focus-map alignment are already repaired (focus-map commit 7b66b04942f64147c32a983b863f6e01ec165241). The active curriculum currently has 36 five-day weeks; Weeks 2–6 include authored instruction, worked examples, independent tasks and unique question sets. This audit does not reintroduce earlier generic lessons or overwrite those materials.

## Confirmed five bubbles, now repaired

1. **Two competing quiz scorers on an assessment page.**
   Grade 1 HTML calls `Grade1Mastery.renderAssessment()` before the shared Elementary formal engine script loads, which could mount the original fixed-form question/scoring listener temporarily. The Grade 1 legacy scorer now declines to initialize if that page already declares the shared assessment-engine script. The shared randomized engine remains the sole formal page scorer. No quiz answer bank or grading threshold was modified.

2. **Open daily-work page reattributing saved work after learner switching.**
   The original daily `input`, handwriting, local completion, pad clear and note handlers used `load()/save()` against whoever was *currently* active. The lesson page now pins its starting learner and guards each writable control; identity changes conceal the previous learner's open daily-work panel, and saving requires a fresh lesson load. Family change and cross-tab storage events are handled using existing context events, with no new profile service.

3. **False-positive save acknowledgments.**
   Old typed autosave, handwriting, day completion, clear, and weekly note controls called `save(st)` and ignored storage errors. Save results now distinguish success and failure; local completion checkbox changes roll back if storage fails, and warnings tell learners to preserve text manually. No legacy records were deleted or migrated.

4. **Week 02–06 printables no longer reflected daily lesson depth.**
   Five printable packets had repeated generic checklist rows and a blank work box but no day-specific independent tasks. Each now renders its own existing five daily focuses, exact objectives, independent-practice prompts and evidence requirements from the active curriculum. Existing Academy evidence headers, print link, student name/date fields, styling and other packets are preserved.

5. **Narrow-view handwriting overflow and resize ink loss.**
   The Grade 1 canvas initialization imposed at least 280 px drawing width even on narrower devices, and resizes cleared the canvas before restoring only a saved image. Width now follows the available drawing area (7 px defensive minimum); unsaved ink is preserved via a temporary image when the canvas is resized. Canvas controls remain unchanged.

## Related small correction
The Grade 1 lesson lock notice and quiz return link now point to the **midterm** rather than the prior weekly quiz when a Week 19+ student lacks 80% midterm mastery. The formal midterm policy was already in force; this only aligns the original student-facing routing with it.

## Verified code changes on main
- Grade 1 renderer, owner and handwriting repairs: `a1206b61dee6c46e9a7307b6c38e725fcd63b001`, `0bd4490a977c90f47f20e90b40e0c4d786e01d88`
- Five authored printable-alignment commits: Week 02 `23e65f70fefd70fa0ba5fc7e8da8166e7239a897`; Week 03 `682f1721e943add3aa081ba3f2a4ba7afbd8c11a`; Week 04 `fedd2ed1f93fe516834562ed76b3b2448bf98ecd`; Week 05 `388b6d6276c50ed784899958c9eb8640ca8c2358`; Week 06 `a7eef30fc2a8d25906c85e6ce305c13c72549346`
- Print alignment validator: `5c179260a06b883c08f8e763c83b6f59e18e58c9`
- Experience CI paths update: `0ff0aabf6ba4bbc10ee706e56d870a9fa469b8c2`
- Elementary formal source regression: `ee783dfea92100f7b929def4add08b7a76d74d6a`

## Automated evidence
- Elementary Learning Engine Regression **SUCCESS**: https://github.com/vervenveda/Khaemenes_Elementary.github.io/actions/runs/40447983616
- Elementary Experience Regression **SUCCESS**: https://github.com/vervenveda/Khaemenes_Elementary.github.io/actions/runs/40447979441
- Source parsed, unchanged dynamic style block confirmed; no second grader, CSS controller, Mentor persona or data store introduced.

## Not yet certified
- A physical/touch or real-browser 255px pen resize while ink is unsaved.
- Two fictional learners switching mid-keystroke, including cross-tab storage events, reload and saved evidence attribution.
- A real-browser full Week 01 → 06 course assessment journey, including unlocked/locked midterm routing.
- Educator authorization and locked official marking guidance are outside this change. No client-only state can substitute for authenticated authorization.
- Remaining Grade 1 Weeks 07–36 and Grades 2–5 need their own day-by-day depth and printable alignment certifications.

## Change discipline
No new CSS, additional chat handlers, conflicting learning engine, teacher answer-key exposure, or 80% mastery-policy changes. Original curriculum data, quiz banks and learning journal storage schema preserved.
