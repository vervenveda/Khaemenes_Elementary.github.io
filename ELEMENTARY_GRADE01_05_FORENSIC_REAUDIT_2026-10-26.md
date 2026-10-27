# Khaemenes Academy Elementary · Grades 01–05 Fresh Forensic Reaudit
Date: 2026-10-26 (America/New_York)
Branch: main
Scope: Grade 1 through Grade 5 across lessons, assessments, formative evidence, teacher/portfolio workflows, academic depth, mentor continuity, learner isolation, printables, and navigational gates.

## Evidence and scope limits
- Main-repository tree queried directly: 2,609 tracked files; 193 Grade 01, 409 Grade 02, 445 Grade 03, 446 Grade 04, 446 Grade 05 files.
- Prior live-main audit (2026-10-23) recorded structural coverage of 1,188 lesson surfaces, 228 formal assessment surfaces, 1,008 non-civic subject-week pages, 2,880 generated questions and 844 large-pool question validations.
- Representative source samples in the fresh pass: Grade 01 first lesson/assessment, Grades 02–05 Mathematics and Science early/late-year lessons, Grade 04 Language Arts Week 20, Grade 03 Science Week 25, Social Studies canonical redirects, Grade 05 Week 36, grade-level dashboards/certificates and shared factory, ledger and formal assessment engines.
- Live GitHub Actions and Pages results checked. This pass does not claim an independently executed full 2,609-file visual-browser sweep or STOS/server authorization audit.
- Canonical teacher/course grading, learner registration and Archaemenes Core were left in place. Neither shared learning ledger, question factory, printed authored lesson content, nor CSS stylesheets were replaced.

## Positive baseline
- Existing full-year structural and learning-engine validators passing before changes.
- Formal 80% threshold, randomized pool generation, learner-scoped formal storage, per-learner ledger, midterm/final, original lesson pages, printables, and separate civic courses exist.
- Grade 01 has its distinct 36-week mastery engine; Grades 02–05 use multi-subject week pages and one shared formal assessment engine.
- Latest observed post-fix run before this report: Elementary Learning Engine Regression on `fcff01128e` succeeded, as did its Pages deployment. The certificate source regression later succeeded on `f05e965621`. A further expanded CI run including all certificate assertions was triggered on `577961e6`; consult Actions for its final status.

## Confirmed forensic bubbles, changes on main

### 1. Competing Grade 01 visible grading pathways — repaired
The Grade 01 historical fixed-quiz form still binds a local scoring handler. The shared formal assessment engine hides the prior form, but its generic "Show Printable Teacher Rubric" toggle could reveal the interactive fixed-form scorer. Its toggle is now limited to non-interactive paper rubrics, and an additional guard prevents revealing any legacy section containing `#quizForm`.
The original Grade 1 lesson, local work, legacy preservation/recovery and scripts are untouched.

### 2. Grade 01–05 second-half assessment boundary — repaired
Previously, the shared formal weekly gate required only the prior week's 80% for Week 19, omitting the formal 80% midterm boundary. Week 19+ now checks the midterm as well as the prior week. Grade 01's independent `isWeekUnlocked()` now follows the same policy and its old final form also requires midterm completion.
Synthetic gate checks validated all five grades at a 79%/80% midterm boundary and a Week 20 prior-week failure.

### 3. In-flight learner switching during formal assessment — repaired
A started quiz previously read the active learner only at submission time. The formal engine now pins the starting learner, scoped course key and eligibility. If identity or eligibility changes before submission, it refuses grading and saving, disables that attempt and explains why. A full live two-tab/student-browser attempt-switch test remains outstanding; permanent structural regression checks cover the guard.

### 4. Grade 01–05 Week 36 navigation — repaired
Shared assessment `nextHref()` previously returned `midterm.html` at Week 36. It now targets `final-exam.html` when the legitimate formal prerequisites have been met.

### 5. Grade 01–05 unlinked preview certificate pathway — repaired
Grades 02, 03 and 05 accepted a completed unowned legacy state to display official certificate markup. Grade 04 already required a matching Academy learner. Grades 02, 03 and 05 now use the same identity requirement; Grade 01 requires `academyContext().match` in certificate eligibility.
Synthetic tests verified unassigned legacy previews remain locked, a matching fictional enrolled learner can complete the certificate view, and sibling identity does not inherit it in Grades 02–05. Grade 01 has a structural certification check.

## Open curriculum and security bubbles — do not describe as certified

### 6. Released weekly objective vs generated formal quiz alignment — needs authored alignment
The first-party formal factory `makeBalanced()` cycles through eight broad subjects, with finite reusable scenario banks and focus-keyword weighting. That is appropriate for a broad integrated diagnostic, but does not establish a documented week-specific blueprint linking each scored question to taught lesson evidence. A 36-week authored coverage map, curriculum review and independent transfer questions are required before asserting comprehensive per-week alignment. Existing randomized formal grading must not be replaced by ad-hoc student self-checks.

### 7. Subject-day academic depth mismatch — confirmed example
`grades/grade-03/subjects/science/week-25.html` is titled "Measurement: Mass, Volume, and Time" but its five authored daily Focus labels are "ecosystems", "fossils", "weather", "climate" and "engineering". These are not a coherent five-day direct teaching sequence for mass, volume and time. Its generic daily Activity and Evidence prose also does not supply measurement exemplars or calibrated practice. The week-specific question, genuine measurement investigation, worked examples, evidence, printable and rubric should be surgically aligned after curriculum review. Do not generalize this exact mismatch to every week without inspection.

### 8. Portfolio adult-review claim lacks demonstrated authenticated educator authority
The Grade 02–05 dashboards save `state.portfolio` from a visible checkbox, and certificates display "adult-reviewed portfolio" when that local flag is true. Client-local identity match and course keys do not prove a guardian/educator actually reviewed artifacts. This audit did **not** invent a client-side 'authenticated teacher' check or connect answer keys to student mentoring. Before authoritative completion claims, adopt Academy's actual revocable educator permissions with verified review evidence. Where no trusted service exists, clearly label provisional/local status.

### 9. Offline/browser-local academic authority is not server-side credential validation
Even randomized questions and local learner scopes run in a user-controlled browser. Browser storage and JavaScript cannot independently prove identity, tamper resistance or teacher-key secrecy. Keep student-visible explanatory feedback separate from teacher-only marking guidance; only an authenticated trusted server (or equivalent explicit human credential review) can grant enforceable private access.

## Changed runtime files
- Shared formal assessment engine: `30e21ee0123b7e142059d231e58285c5faa63688`
- Grade 01 mastery gates and final policy: `d27bb17d031cf48def014d89a8239ba9ba7b28a4`
- Grade 01 official certificate identity guard: `eedba07c328a2ea25844eb25395d53c06ef70aaa`
- Grade 02 certificate: `46441c0bc0d41ad3e2d023d09fbbe3b3db220bb3`
- Grade 03 certificate: `10cdda73f98f7d340123582fec752d94a3d70c8e`
- Grade 05 certificate: `f05e965621aede6b8e1cd1cc64c260c592ab092c`
- Persistent regression: `tests/elementary-formal-boundaries.test.cjs`; workflow `.github/workflows/elementary-learning-engine-regression.yml`.

## Recommended next surgical sequence
1. Await/review final CI job results, then run live two-fictional-learner browser journeys for begin quiz -> switch learner -> submit refused -> reselect -> new attempt -> reload -> assessment evidence -> correct next link.
2. Author-grade review of Grade 03 Science Week 25 and its accompanying printable/rubric against the curriculum map, preserving all saved evidence.
3. Expand weekly lesson/question blueprint mapping across Grade 01, then Grades 02–05: exact lesson objective, authored worked examples, formative practice, verified formal targets and remediation skills.
4. Audit the adult portfolio approval journey with the actual Family Registry permission authority; avoid equating a local checkbox to authenticated approval.
5. Test keyboard/mobile/read-aloud/printable use in a production browser at 255px width, then continue the subject-by-subject, week-by-week academic-depth audit.

## Retained rules
No competing AI commands, styles or graders. Main branch only. No destructive legacy migration. No copying teacher answers into learner responses. No lowering 80% mastery or mixing formative scores into formal certification. No assertion of production authorization without corresponding evidence.
