# Observation Lab 🔬

**Khaemenes Elementary · Grades 1–5 · Science**

Observation Lab is a sovereign, sandboxed, dependency-free scientific notebook designed for repeated use across the elementary science curriculum.

It is intentionally **photograph-free by default**. Learners observe the real world directly and record what they notice through writing, drawing, measurements, comparisons, and evidence.

The core inquiry cycle is:

> **Predict → Observe → Measure → Draw → Compare → Conclude**

---

## Design Inspiration

Observation Lab takes interaction ideas from the Bazaar Art ecosystem—especially the page/journal/portfolio feel of the Sovereign Family Photo Album—without turning the science notebook into a photo application.

Useful ideas adapted into the science context include:

- page-like entries
- editable titles / notes
- local-first preservation
- portfolio review
- entry-by-entry navigation
- visual review of saved work

The science version deliberately replaces photography with direct observation, drawing, measurements, and written evidence.

---

## Core Features

### Prediction

Learners record what they think will happen before observing or changing a condition.

Prompts become more sophisticated by grade.

### Observation

Learners describe what they actually notice before interpreting it.

Possible descriptors include:

- size
- number
- shape
- color
- position
- texture
- temperature
- time
- motion
- pattern

### Evidence

Learners identify evidence supporting an observation or claim.

Evidence may include:

- measurements
- counts
- repeated observations
- drawings
- patterns
- clearly described details

### Conclusion

Learners summarize what they learned and, at later grades, connect claims to evidence and reasoning.

### Drawing Canvas

A built-in drawing canvas supports:

- diagrams
- arrows
- labels
- visual models
- before/after sketches
- motion paths
- observational drawings

The canvas:

- auto-saves locally
- can be manually saved
- can be exported as PNG
- prints with the notebook

### Measurement Table

Learners may create measurement rows with:

- what was measured
- value
- unit / count

A simple template can be loaded for:

- length / height
- count
- time

### What Changed?

The before/after comparison area asks learners to record:

- what changed
- what stayed the same
- what evidence shows the change

### Local Lab Book

Saved entries form a local observation portfolio.

Each saved entry stores:

- date
- grade
- topic
- mission
- prediction
- observation
- evidence
- conclusion
- before / after comparison
- measurement table
- drawing

### Compare Saved Observations

Learners may select two saved observations and write a comparison note identifying:

- a pattern
- a change
- a difference
- a similarity

---

## Grade-Aware Progression

Observation Lab does not simply make the same prompt harder.

### Grade 1

Focus:

- noticing
- naming
- sorting
- describing observable properties
- simple drawings
- counts
- before / after language

### Grade 2

Focus:

- changes over time
- simple measurements
- comparison
- patterns
- evidence from counts, drawings, and observations

### Grade 3

Focus:

- repeated observations
- measurements
- patterns
- simple models
- relationships

### Grade 4

Focus:

- variables
- controlled comparisons
- structured measurement tables
- cautious cause/effect reasoning
- evidence consistency

### Grade 5

Focus:

- repeated measurements
- claims-evidence-reasoning
- comparison of datasets
- variables
- uncertainty
- stronger scientific explanations

---

## Observation Topics

Built-in topic families include:

- Plants
- Weather
- Materials
- Motion
- Light
- Water
- Earth / Soil
- Custom observation

These are broad enough to support the lab across many science units.

---

## Monte Carlo-Style Prompt Adaptation

Observation Lab contains a local, lightweight adaptive prompt engine.

It tracks confidence estimates for:

- observation
- measurement
- evidence
- comparison

When **Adaptive Lab** is selected, the app simulates candidate prompt focus locally and chooses one near a productive-success target.

No outside AI service is called.

The interface displays:

- estimated success
- simulation count
- selected focus

---

## Friendly Voice Standard

Observation Lab uses only friendly child-facing guide personalities:

- **Sunny** ☀️
- **Science Sage** 🦉
- **Bloom** 🌼
- **Rainbow Friend** 🌈

The voice layer:

- uses local browser `SpeechSynthesis`
- prefers English voices available on the device
- filters common novelty/effect-style voice names when possible
- supports Slow & Clear, Gentle, and A Little Lively pacing
- includes Preview, Repeat, and Stop
- stops narration when voice is switched off or the page is left
- never records audio
- never uploads audio
- requires no remote voice provider

---

## Saving

Observation Lab automatically saves journal work locally under:

```text
khaemenes_observation_lab_k5_v1
```

The current drawing is stored under:

```text
khaemenes_observation_lab_canvas_v1
```

Saved state may include:

- grade
- topic
- lab mode
- current mission
- prediction
- observation
- evidence
- conclusion
- comparison fields
- measurements
- saved lab entries
- comparison notes
- mastery estimate
- skill estimates
- voice preference
- recent history

---

## Export

The complete session can be exported as:

```text
observation-lab-session.json
```

The export includes:

- application metadata
- full journal state
- saved entries
- measurements
- local drawing image data

The current drawing may also be exported separately as:

```text
observation-lab-drawing.png
```

---

## Printing

The print stylesheet prepares:

- current mission
- prediction
- observation
- evidence
- conclusion
- drawing
- measurement table
- what-changed comparison
- saved portfolio sections

for browser printing or **Save as PDF**.

---

## Sovereign / Sandboxed Architecture

Observation Lab uses only:

- HTML
- CSS
- vanilla JavaScript
- browser `localStorage`
- Canvas API
- browser `SpeechSynthesis`
- Blob/Object URL APIs for explicit export

It does **not** use:

- external libraries
- external fonts
- trackers
- analytics
- advertisements
- network APIs
- camera access
- photo uploads
- remote AI
- cloud accounts
- third-party storage
- `eval()`
- `Function()`

The app runs as a standalone `index.html`.

---

## Privacy

Observation Lab does not require:

- student name
- email
- address
- exact birth date
- photograph
- camera
- microphone recording
- account
- login

All work stays local unless explicitly exported.

---

## Recommended Repository Location

```text
Khaemenes_Elementary/
└── games/
    └── observation-lab/
        ├── index.html
        └── README.md
```

---

## Curriculum Use

Observation Lab is intended to be reused across nearly every elementary science week.

Examples:

- plant growth
- weather
- properties of matter
- changes in materials
- forces and motion
- light and shadows
- water
- soil and erosion
- ecosystems
- engineering tests
- repeated measurements
- before / after comparisons

---

## Design Principles

1. **Observe before explaining.**
2. **Evidence can be drawn, counted, measured, or described.**
3. **Scientific drawings are legitimate scientific records.**
4. **Repeated observations are more powerful than one snapshot.**
5. **Comparison should focus on the same feature across time or conditions.**
6. **Grade progression should deepen scientific thinking, not merely vocabulary.**
7. **No photograph is required for meaningful science.**
8. **Everything important should be saveable and printable.**
9. **Friendly voices should support, never distract.**
10. **No unnecessary learner data should leave the device.**

---

## Ownership

Observation Lab is part of the Khaemenes Academy / Verve N Veda educational ecosystem.

Copyright © 2026 Jennifer Kay Pearl.  
All Rights Reserved.
