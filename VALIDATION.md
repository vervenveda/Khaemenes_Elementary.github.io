Khaemenes Elementary Academy — Root Validation Report

Generated: 2026-08-08

This validation file documents the intended root-level architecture for the Khaemenes Elementary Academy repository.

Root Purpose

Status: Valid after root repair

The repository root should be the Elementary Academy landing hub.

The root index.html should identify as:

Khaemenes Elementary Academy

It should not identify as:

Khaemenes Academy First Grade · Wonderverse

Required Root Features

The root landing page should include:

Student-friendly welcome / top-page header

Student profile section

Parent / family profile section

Local browser saving through localStorage

Grade pathway buttons for Grades 01–05

Student daily flow

Parent review flow

Progress snapshot overview

Export profile JSON option

Print profile option

Middle School bridge links for Grades 06–08

Footer attribution to Jennifer Kay Pearl

Expected Root Files

Recommended root-level files:

index.html
README.md
VALIDATION.md
LICENSE.md

Optional but recommended:

.nojekyll
404.html
UPLOAD_MAP.md

Expected Grade Folders

The Elementary repository should contain:

grades/grade-01/
grades/grade-02/
grades/grade-03/
grades/grade-04/
grades/grade-05/

Grades 06–08 should remain in the separate middle school repository unless intentionally mirrored.

Grade 01 Validation

Status: Usable

Grade 01 is allowed to remain unit-based.

Expected major folders/files:

grades/grade-01/index.html
grades/grade-01/assets/
grades/grade-01/data/
grades/grade-01/lessons/
grades/grade-01/printables/
grades/grade-01/assessments/
grades/grade-01/teacher-tools/
grades/grade-01/records/

No subjects/ folder is required for Grade 01.

Grade 02 Validation

Status: Needs one architecture alignment check

Grade 02 may be unit-based, subject-integrated, or subject-hall based.

The important rule is:

The Grade 02 index links must match the actual uploaded folder structure.

If grades/grade-02/index.html links to:

subjects/language-arts/index.html
subjects/mathematics/index.html
subjects/science/index.html
subjects/social-studies/index.html
subjects/arts-music/index.html
subjects/health-pe-sel/index.html
subjects/technology/index.html
subjects/integrated-projects/index.html

then this folder must exist:

grades/grade-02/subjects/

If subjects/ is not present, either upload the missing subject folders or replace Grade 02 with a unit/integrated index that does not link to missing pages.

Grades 03–05 Validation

Status: Subject-hall structure expected

Grades 03–05 should include:

index.html
assets/
data/
subjects/
weekly-plans/
printables/
assessments/
teacher-tools/
records/
README.md
UPLOAD_MAP.md
VALIDATION.md
LICENSE.md

Expected design:

36 weeks

8 subject halls

Weekly plans

Printable packets

Weekly assessments

Midterm

Final exam

Teacher tools

Certificate / records system

Local progress tracking

Attribution to Jennifer Kay Pearl only

Middle School Bridge Validation

Status: Separate repository

The Elementary root may link to the separate middle school repository:

Khaemenes_Middle.github.io

Expected middle school grade folders:

grades/grade-06/
grades/grade-07/
grades/grade-08/

Dependency Scan Standard

Root and grade landing pages should avoid required outside dependencies.

Expected result:

External scripts: none required
External fonts: none required
CDN dependency: none required
Required outside images: none required

Attribution Validation

Expected attribution:

Jennifer Kay Pearl

Current Known Follow-Up

The root homepage repair is complete when the live root page opens as Khaemenes Elementary Academy.

Remaining cleanup to check after upload:

Replace old root First Grade README.md with this Elementary README.

Replace old root First Grade VALIDATION.md with this Elementary validation file.

Confirm Grade 02 does not contain subject-hall links without an uploaded subjects/ folder.

Final Status

Overall status: Elementary root architecture repaired; documentation update ready.

The Elementary repository should now function as:

Root landing hub → Grades 01–05 → Middle School bridge

rather than:

Root First Grade page → mixed grade folders
