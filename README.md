#Khaemenes Elementary Academy

Generated: 2026-08-08

Khaemenes Elementary Academy is the root landing hub for the elementary school division of Khaemenes Academy. It organizes the student-friendly entry experience, parent/family profile tools, grade pathways, progress snapshots, and the bridge into the separate Khaemenes Middle School repository.

Repository Role

This repository root should serve as the Elementary Academy home, not as an individual grade course.

The root index.html is responsible for:

Student-friendly welcome and navigation

Student profile setup

Parent / family profile setup

Local browser profile saving

Grade pathway routing for Grades 01–05

Family review flow

Progress snapshot overview

Exportable local profile records

Bridge links into the middle school repository for Grades 06–08

Grade Pathways

The elementary grade portals are organized under:

grades/grade-01/
grades/grade-02/
grades/grade-03/
grades/grade-04/
grades/grade-05/

Grade 01 — First Grade

Grade 01 is an early elementary unit-based course. It does not need to match the later subject-hall architecture.

Expected major parts:

index.html

assets/

data/

lessons/

printables/

assessments/

teacher-tools/

records/

Grade 02 — Second Grade

Grade 02 may be maintained as a subject-integrated or subject-hall course depending on the uploaded package version.

Important maintenance note: if the Grade 02 index.html links to subjects/..., then the subjects/ folder must also be present. If the downloaded/uploaded Grade 02 package is unit-based or integrated without a subjects/ folder, then the Grade 02 index should not link to missing subject-hall pages.

Grades 03–05 — Subject-Hall Elementary Courses

Grades 03, 04, and 05 use the larger subject-hall structure.

Expected major parts:

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

Middle School Bridge

Grades 06–08 belong in the separate middle school repository:

Khaemenes_Middle.github.io

The elementary landing page should bridge to:

/Khaemenes_Middle.github.io/
/Khaemenes_Middle.github.io/grades/grade-06/index.html
/Khaemenes_Middle.github.io/grades/grade-07/index.html
/Khaemenes_Middle.github.io/grades/grade-08/index.html

Local Records and Privacy

The elementary landing page uses browser localStorage for the student and parent profile tools.

Profile data remains local to the device/browser unless the family chooses to export the JSON profile record.

No server account is required.

Dependency Policy

The root landing page is designed to run without outside dependencies.

Expected policy:

No CDN scripts

No external font calls

No outside worksheet assets required

No external curriculum embeds required

All core navigation should use repository-relative or sibling-repository links

Attribution

Created for Khaemenes Academy / Verve N Veda.

Attribution:

Jennifer Kay Pearl

Maintenance Checklist

Before considering the Elementary repository complete, confirm:

The root index.html opens as Khaemenes Elementary Academy.

The root is no longer a First Grade-specific page.

Grades 01–05 all have working index.html files.

Grade 01 remains safely inside grades/grade-01/.

Grade 02 links match its actual folder architecture.

Grades 03–05 retain their subject-hall folders and weekly plans.

The middle school bridge points to the correct middle school repository.

Root README.md and VALIDATION.md describe the Elementary Academy hub, not First Grade only.
Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda
