# Force & Motion Ramp Lab 🛹

**Khaemenes Elementary · Grades 1–5 · Week 23 + Engineering**

Force & Motion Ramp Lab is a sovereign, dependency-free simulator for exploring how ramp height, surface, object mass/category, and push strength affect motion.

## Reference architecture

The simulator borrows the clean interaction pattern from the Verve N Veda Finance **Supply & Demand Simulator**:

- visible sliders
- immediate recalculation
- a graph/canvas
- clearly labeled numerical outputs
- side-by-side variable controls
- a transparent mathematical model

The finance simulator computes and draws demand and supply lines from user-controlled slider values and then calculates their intersection to report equilibrium price and quantity. Force & Motion Ramp Lab uses the same transparent **change an input → recalculate → visualize → compare output** architecture, translated into elementary physics and engineering.

## Scientific model

The simulator uses a simplified, educational classical-mechanics model rather than arcade randomness.

The internal reasoning draws from:

- gravitational potential energy
- push work
- frictional energy loss
- kinetic energy
- speed derived from energy per unit mass
- deceleration from surface friction
- stopping distance

The model is intentionally simplified for elementary learning, but it preserves real directional relationships:

- higher ramps generally increase available gravitational energy
- stronger pushes generally increase motion
- greater friction generally reduces travel distance
- surface and object type alter rolling/sliding efficiency
- mass participates in the energy and friction calculations rather than acting as a decorative variable

## Grade-aware progression

### Grade 1
Pushes and pulls; faster/slower; farther/shorter; simple cause/effect.

### Grade 2
Fair comparisons: change one variable and compare motion outcomes.

### Grade 3
Repeated trials, measurements, tables, and pattern recognition.

### Grade 4
Controlled variables, structured investigations, friction and energy reasoning.

### Grade 5
Quantitative comparison, graphing, proportional reasoning, repeated trials, and engineering optimization.

## Core features

- adjustable ramp height
- adjustable object mass
- adjustable push strength
- selectable object category
- selectable surface
- adjustable friction
- animated ramp run
- distance, speed, time, and energy readouts
- trial recording table
- last-two-trial comparison
- outcome graph
- engineering target-distance challenge
- prediction and conclusion fields
- local mastery tracking
- adaptive Monte Carlo-style challenge selection
- friendly local voices
- save, JSON export, and printing

## Fair-test emphasis

The app repeatedly teaches:

> Change one variable while keeping the others the same.

At upper elementary levels this expands into independent, dependent, and controlled-variable language.

## Monte Carlo adaptation

A local Monte Carlo-style selector estimates productive challenge focus using local skill estimates and a target near 72% predicted success. No remote AI service is used.

## Friendly voices

- Sunny ☀️
- Motion Sage 🦉
- Bloom 🌼
- Rainbow Friend 🌈

Speech uses only local browser `SpeechSynthesis`.

## Saving

Local key:

`khaemenes_force_motion_ramp_lab_k5_v1`

The app saves:

- grade
- lab mode
- object
- surface
- ramp height
- mass
- push strength
- friction
- recorded trials
- mastery estimate
- skill estimates
- engineering target state
- prediction / conclusion
- voice settings
- recent history

## Export

Session backup:

`force-motion-ramp-lab-session.json`

## Sovereign architecture

One standalone `index.html` using only HTML, CSS, and vanilla JavaScript.

No:
- frameworks
- outside fonts
- APIs
- trackers
- analytics
- advertisements
- cloud accounts
- remote AI
- third-party storage
- `eval()`
- `Function()`

## Recommended location

`Khaemenes_Elementary/games/force-motion-ramp-lab/`

Files:
- `index.html`
- `README.md`

## Design principle

**The simulator should reveal relationships, not hide them behind game scoring.**

Students should be able to change one factor, run a trial, record evidence, graph the result, and explain what changed.

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
