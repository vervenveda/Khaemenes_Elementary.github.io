# My School Year — Elementary Journal & Yearbook

A sovereign, local-first Grades 1–5 school-year journal and memory book.

## Core features
- 36 weekly journal entries
- developmentally friendly reflection prompts
- title, learning reflection, proud moment, curiosity field
- mood check-in
- built-in drawing canvas
- local autosave
- JSON backup export
- print / Save PDF
- student / grade / school-year / mentor metadata
- built-in photo yearbook
- photo captions and memory notes
- image downscaling before local storage
- end-of-year reflection pages

## Design lineage
The project deliberately combines ideas from two existing Verve N Veda resources:

1. Bazaar Art's Sovereign Family Photo Album: book/memory-page thinking, local photo upload, captions, album presentation, and image-centered storytelling.
2. ProReSources / PROSE: paper-like editorial presentation, structured writing, preservation, and reusable writing/template philosophy.

The implementation itself is rewritten for elementary learners and has no runtime dependency on those apps.

## Privacy
Photos, drawings, and writing remain in browser localStorage. There is no server upload, account, tracker, analytics library, or external dependency.

**Important:** browser localStorage is limited. The app downsizes uploaded photos, but a large yearbook can still fill storage. Export the JSON backup regularly.

## Suggested repository location
`Khaemenes_Elementary.github.io/apps/elementary-school-year-journal/index.html`

## Technology
Single-file HTML/CSS/vanilla JavaScript. No build step.

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
