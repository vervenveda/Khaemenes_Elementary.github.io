# Grade 4 — Weeks 19–36 Forensic Instructional Depth Audit
Date: 2026-11-09
Branch: `audit/elementary-family-report-2026-11-09`
Scope: 18 weeks × 8 subject halls = 144 late-year subject lesson routes.

## Source findings and targeted repairs
1. **Repetitive five-day wording.** Sampled subject lessons repeat the same introductory, practice, application, revision and portfolio script across multiple weeks. A supplementary Grade 4 learning studio now provides a topic-specific scenario, worked quantitative reasoning and explicit evidence check on Weeks 19–36. Original pages were not overwritten.
2. **Worked examples are disconnected from subject lessons.** Existing six-week instructional companions contain valuable concrete examples; the new studio exposes concrete weekly reasoning directly within each late-year subject lesson.
3. **Subject-specific actions were under-specified.** The studio adds three differentiated steps per subject (Language Arts, Mathematics, Science, Social Studies, Arts & Music, Health/PE/SEL, Technology & Tools, and Integrated Projects) on every applicable late-year page.
4. **Evidence and revision expectations were generic.** The studio asks for draft/model evidence, a documented correction and a limitation. These are *practice prompts*, not new mastery requirements.
5. **Instruction-to-assessment handoff was fragmented.** Each studio links to its matching full-week plan, printable packet and formal assessment; the authoritative assessment engine is unchanged.

## Delivery topology
- New module: `assets/khaemenes-grade4-late-year-depth.js`
- Lazy entry point: `assets/khaemenes-elementary-learning-ledger.js`
- Guard: routes matching Grade 4 subject lesson Weeks 19–36 only
- Student data: none read or written by the studio
- Academic authority: no changes to grading, portfolio approval, unlocks, progression or student placement
- Supplementary curriculum: **not** an independent assessment, official grade, or claim that every existing lesson has been manually rewritten

## Verification
Run `node --test tests/grade-four-late-year-instructional-depth.test.cjs` and relevant existing Grade 3/4 regressions. Automated checks verify JavaScript parsing, all 144 lesson files, the existing learning-ledger entry point, rendered studio content, matching routes, and no local-storage/mastery writes.

## Remaining bubbles for a dedicated curriculum review
- Several original lesson headings and subject-specific 'Focus' labels are weakly aligned (for example, Mathematics Week 30 repeats a division-with-remainders focus under an angle-measurement title). These original passages remain to be rewritten or corrected.
- The studio's worked quantitative example is shared across subjects within a week. Expert review should ensure each subject has enough discipline-specific *worked* examples, not merely distinct activity instructions.
- Verify actual readability, print behavior, keyboard access, voice/translator parity and responsive layout in browsers.
- Review source attribution and local history contextualization in the specialist Social Studies pathway.
- Verify capstone assessment rubrics and real adult-review flow without treating static browser flags as authority.

No live deployment or student record mutation was carried out during this audit.
