# Pattern Coder 🤖

**Khaemenes Elementary · Grades 1–5 · Technology / Computer Science**

Pattern Coder is a sovereign, local-first learning game inspired by the Coding 101–103 progression.

The child guides a friendly robot through a maze using a simple command language:

- Forward
- Turn Left
- Turn Right
- Repeat ×2
- Repeat ×3
- If Wall Ahead → Turn Right

The learner then tests, debugs, refines, and explains the algorithm.

## Learning design inherited from the 100 series

Pattern Coder intentionally combines the strongest ideas from the updated 100-series courses:

### Coding 101
- algorithms
- sequence
- events and actions
- loops
- conditions
- testing

### Coding 102
- systems thinking
- state and data
- input / processing / output reasoning
- structured run data

### Coding 103
- decomposition
- pattern recognition
- state
- pseudocode-style planning
- reproduce → isolate → inspect → hypothesize → change one thing → retest
- best-score / mastery style progress

Pattern Coder translates those ideas into one elementary game rather than requiring typed code.

## Grade progression

### Grade 1
- short command sequences
- forward / left / right
- identify start and goal
- observe when one step is wrong
- explain a simple sequence

### Grade 2
- longer sequences
- test a full algorithm
- debug a wrong turn
- change one command at a time
- explain the fix

### Grade 3
- repetition
- Repeat ×2 / ×3
- compare longer and shorter algorithms
- collect run data
- discuss efficiency

### Grade 4
- conditional behavior
- If Wall Ahead → Turn Right
- edge-case thinking
- one-change debugging
- compare repeated tests

### Grade 5
- algorithm optimization
- state / systems reasoning
- command efficiency
- evidence-based refinement
- multiple valid solutions

## Maze engine

Mazes are procedurally generated locally.

The generator:
1. creates a wall grid
2. preserves start and goal cells
3. checks reachability with breadth-first search
4. regenerates if no path exists
5. computes a shortest path for efficiency comparison

This means a generated mission is guaranteed to have at least one valid route.

## Command engine

The program is stored as a command list.

Repeat commands expand the immediately previous executable command.

The Grade 4+ conditional command:

`IF wall ahead → turn right`

tests the robot's current state at execution time.

The engine does not use `eval()` or `Function()`.

## Debugging workflow

Each mission includes:

- Observe
- Hypothesis
- One Change
- Retest

The learner is encouraged to preserve evidence by changing one thing at a time.

## Run data

Each run stores:
- grade
- program command count
- movement count
- result
- simple efficiency estimate

This supports algorithm comparison and data reasoning.

## Explanation / reflection

Students can save:
- algorithm explanation
- debugging hypothesis
- full command list
- maze
- grade
- mission mode

These are stored as local portfolio evidence.

## Friendly voices

Available guides:
- Sunny ☀️
- Code Sage 🦉
- Bloom 🌼
- Rainbow Friend 🌈

Speech uses local browser `SpeechSynthesis` only.

## Local saving

Storage key:

`khaemenes_pattern_coder_k5_v1`

## Export

Session export:

`pattern-coder-session.json`

## Printing

The app supports browser Print / Save PDF for teacher or portfolio evidence.

## Sovereign architecture

Single standalone file using only:
- HTML
- CSS
- vanilla JavaScript
- localStorage
- SpeechSynthesis
- browser Blob export
- browser print

No:
- external libraries
- external fonts
- trackers
- analytics
- advertisements
- cloud accounts
- remote AI
- third-party storage
- `eval()`
- `Function()`

## Recommended repository location

`Khaemenes_Elementary/games/pattern-coder/`

Files:
- `index.html`
- `README.md`

## Curriculum use

Especially appropriate for:
- Technology Weeks 2–5
- Week 21
- Week 23
- Week 26
- Week 33
- algorithms
- sequencing
- patterns
- repetition
- conditions
- systems
- testing
- debugging
- refinement
- elementary engineering / computational thinking

## Design principle

**Children should learn to think like programmers before they are required to type like programmers.**

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
