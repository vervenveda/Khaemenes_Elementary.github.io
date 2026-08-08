# Bazaar Junior Art Studio 🎨

**Khaemenes Elementary · Grades 1–5 · Visual Arts**

Bazaar Junior Art Studio is a local-first elementary digital art studio inspired by the broader Bazaar Art ecosystem.

It includes:

- digital drawing canvas
- brush and eraser
- lines
- shapes
- vertical / horizontal / four-way symmetry
- stamps
- collage-style placement
- pattern tools
- simple color theory
- poster mode
- exhibit labels
- undo / redo
- local exhibit portfolio
- PNG export
- project JSON export
- browser printing / Save PDF
- friendly local voices
- optional adult-supervised link to Bazaar Art

## Bazaar Art / Sagaen inspiration

The Studio was designed after inspecting the existing **Sagaen™ Studio** in the Bazaar Art repository.

Sagaen already contains:

- a large HTML canvas
- brush and eraser tools
- brush size
- color picker
- undo / redo
- uploaded-image support
- zoom
- opacity
- image filters
- export to PNG / JPEG / WEBP
- local/manual browser-side rendering

For an elementary school app, Bazaar Junior Art Studio keeps the strongest manual art-tool ideas but simplifies and redirects them toward age-appropriate art learning.

Instead of centering the interface on filters and imported images, the Junior Studio emphasizes:

- line
- shape
- symmetry
- pattern
- color relationships
- revision
- art vocabulary
- composition
- visual communication
- exhibit labels

## Grade progression

### Grade 1
- line
- shape
- color
- simple repeating patterns
- stamping
- basic art vocabulary
- describing artwork

### Grade 2
- symmetry
- warm / cool colors
- shape combinations
- pattern
- simple poster design
- short exhibit labels

### Grade 3
- repetition
- contrast
- planned composition
- revision
- longer artist statements

### Grade 4
- balance
- emphasis
- symmetry / asymmetry
- poster hierarchy
- more purposeful color choices

### Grade 5
- multi-step composition
- design refinement
- visual communication
- exhibit-ready labels
- preparation for supervised use of broader Bazaar Art tools

## Drawing engine

The app uses a native HTML Canvas.

Tools:

- Brush
- Eraser
- Line
- Rectangle
- Circle / ellipse
- Triangle
- Star

### Symmetry

Options:

- Off
- Vertical Mirror
- Horizontal Mirror
- Four-Way

Brush marks, lines, shapes, and stamps can be mirrored.

## Stamps / collage

Built-in local stamps include:

- flower
- star
- leaf
- butterfly
- sun
- moon
- house
- balloon

No external image service is used.

## Pattern tools

Built-in patterns:

- dots
- stripes
- checker
- confetti

The Pattern Lab also displays several visual examples for discussion.

## Color theory

The Junior Studio includes a simple visual color wheel and child-friendly instruction in:

- traditional primary colors
- warm / cool color families
- visual contrast

## Poster mode

Poster fields include:

- title
- message

The poster preview supports simple visual-communication practice.

## Exhibit labels

Each local saved artwork can include:

- title
- artist first name or initials
- medium
- artist statement

Suggested prompts:

- My artwork is about…
- I used…
- I want viewers to notice…

## Local Exhibit

Saved artworks can be stored locally with:

- PNG preview
- grade
- title
- medium
- statement
- date

Storage key:

`khaemenes_bazaar_junior_art_k5_v1`

Because PNG data URLs can be large, the Local Exhibit is intentionally capped to a small number of recent artworks.

## Export

### PNG
Downloads the current artwork as a PNG.

### Project JSON
Downloads:

`bazaar-junior-art-project.json`

The project export includes settings and the current canvas PNG.

## Adult-supervised Bazaar Art gateway

The elementary studio itself is local-first.

A separate button can open the broader Bazaar Art site in a new browser tab.

This action is visually labeled as an adult-supervised gateway so the elementary learning environment remains distinct from the broader public art ecosystem.

## Friendly voices

Available local guides:

- Sunny ☀️
- Art Sage 🦉
- Bloom 🌼
- Rainbow Friend 🌈

Speech uses local browser `SpeechSynthesis` only.

## Sovereign architecture

Single standalone HTML file using:

- HTML
- CSS
- vanilla JavaScript
- HTML Canvas
- localStorage
- SpeechSynthesis
- browser Blob export
- browser printing

No:

- external libraries
- trackers
- analytics
- advertisements
- remote AI
- cloud art storage
- third-party drawing service
- `eval()`
- `Function()`

## Recommended repository location

`Khaemenes_Elementary/games/bazaar-junior-art-studio/`

Files:

- `index.html`
- `README.md`

## Design principle

**Elementary art software should help children make, revise, notice, explain, and exhibit—not merely apply effects.**

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
