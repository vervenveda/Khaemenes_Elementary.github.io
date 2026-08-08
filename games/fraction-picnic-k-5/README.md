# Fraction Picnic 🍕
## Khaemenes Elementary · Grades 1–5

Fraction Picnic is a sovereign, dependency-free visual fraction learning game. It begins as a **second-grade Weeks 13 and 26** experience, but includes a grade selector so the same game can grow with learners from first through fifth grade.

### Grade-aware progression

- **Grade 1:** fraction foundations through equal shares, halves/fourths, and composing/decomposing shapes. This is intentionally enrichment rather than pretending Grade 1 has the later formal Number & Operations—Fractions expectations.
- **Grade 2:** equal shares using halves, thirds, and fourths; fair sharing; visual part-whole language.
- **Grade 3:** fractions as numbers, unit fractions, visual models, simple equivalence, and comparisons.
- **Grade 4:** equivalent fractions, ordering, unit-fraction composition, like-denominator addition/subtraction, and fraction × whole-number reasoning.
- **Grade 5:** unlike-denominator addition/subtraction, fraction as division, multiplication, and real-world fraction reasoning.

The progression is based on the Common Core elementary fraction sequence, while the game remains usable as a broader universal curriculum resource rather than being tied to one state.

## Core experiences

### Picnic Plate
Select equal pieces of pizza, watermelon, sandwiches, or pie to build fractions visually.

### Fair-Share Blanket
Share selected pieces among picnic friends and check whether the distribution is fair.

### Fraction Model Lab
Connect pictures, words, numerator/denominator language, and symbolic notation.

### Compare Picnic Portions
Compare fraction quantities rather than merely comparing numerator/denominator digits.

### Equivalent Picnic Pieces
Generate and recognize visually meaningful equivalent fractions.

### Picnic Stories
Apply fraction reasoning to simple real-world sharing situations.

### Explain My Picnic
Learners type an explanation of their reasoning. The explanation is locally saveable and can be read aloud.

## Adaptive Monte Carlo logic

The game maintains local skill estimates for fair sharing, building, comparison, equivalence, and operations. Candidate success is simulated locally to help choose productive practice. The engine is transparent in the interface and does not call an external AI service.

## Friendly voices

The same friendly guide family used across the Khaemenes elementary games is included:

- Sunny ☀️
- Fraction Sage 🦉
- Bloom 🌼
- Rainbow Friend 🌈

Speech uses only the browser's local `SpeechSynthesis` capability.

## Save / export / print

Fraction Picnic:
- auto-saves progress in browser `localStorage`
- saves learner explanations
- supports explicit manual save
- exports a JSON session backup
- provides a print / Save PDF layout

Local storage key:

`khaemenes_fraction_picnic_k5_v1`

## Sovereign architecture

One standalone `index.html` uses only HTML, CSS, and vanilla JavaScript. There are no external libraries, fonts, analytics, trackers, advertisements, cloud accounts, remote AI services, or third-party storage.

## Recommended repository location

`Khaemenes_Elementary/games/fraction-picnic/`

Files:
- `index.html`
- `README.md`

## Design principle

**The same game should deepen as the child grows rather than simply becoming a harder quiz.**

The visual picnic remains familiar while the mathematics changes from equal sharing to fraction-number reasoning, equivalence, operations, and explanation.

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
