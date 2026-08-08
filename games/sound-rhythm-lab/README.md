# Sound & Rhythm Lab 🥁

**The Refrain · Khaemenes Elementary · Grades 1–5**

Sound & Rhythm Lab is a sovereign, local-first elementary music-computing studio built with browser-native Web Audio.

It combines:

- programmable computer keyboard
- synthesized notes
- synthesized percussion
- beat sequencing
- measure fractions
- tempo
- repetition
- call-and-response
- recording
- quantization
- waveform visualization
- reflection
- local portfolios

## Refrain role

The app is designed as a portable child-facing music laboratory for `the_refrain.github.io`.

Recommended location:

`the_refrain.github.io/apps/Sound_Rhythm_Lab_Elementary_index.html`

It can also be linked from Khaemenes Elementary as the school-facing entry point.

## Keyboard programming

Default playable keyboard:

### Melody
- A
- S
- D
- F
- G
- H
- J
- K

### Percussion
- Q — Kick
- W — Snare
- E — Hi-hat
- R — Clap

Grades 1–2 use a curated fixed mapping.

Grades 3–5 can use the Key Mapping Studio.

The mapping editor supports:

- computer key
- tone / kick / snare / hi-hat / clap
- note
- octave
- test mapping
- restore defaults

Upper elementary students can therefore treat the computer keyboard as a programmable instrument.

## Web Audio engine

All music is generated in the browser.

### Tone synthesis
Oscillator waveforms:

- sine
- triangle
- square
- sawtooth

### Percussion synthesis
Percussion is synthesized locally:

- kick — pitch envelope
- snare — filtered noise
- hi-hat — high-pass noise
- clap — short layered noise bursts

No external samples are required.

## Recording

Press **Record Keyboard**, then perform on mapped computer keys.

Recorded events store:

- time from recording start
- computer key
- sound type
- note where applicable

## Record → Quantize

A recorded keyboard take can be transferred to the 16-step sequencer.

Events are quantized to the nearest step.

This lets students hear the difference between:

- live timing
- grid timing
- repeated timing

## 16-step sequencer

Built-in tracks:

- Tone A
- Tone S
- Tone D
- Tone F
- Kick
- Snare
- Hi-hat
- Clap

The grid represents one conceptual 4/4 measure divided into 16 steps.

## Fractions of measures

The math-learning area introduces:

- whole measure
- 1/2
- 1/4
- 1/8

The main studio also allows 1/4, 1/8, and 1/16 rhythmic division focus.

## Call & response

A local random rhythm generator creates an eight-part "call."

Students can:

- listen
- enter a response
- record a response
- compare the response
- choose to match or deliberately vary the pattern

## Wave visualization

The browser `AnalyserNode` provides a real-time waveform display for generated sounds.

No microphone is used.

## Grade progression

### Grade 1
- steady beat
- fast / slow
- loud / soft
- 4-count patterns
- fixed friendly keyboard

### Grade 2
- 8-count patterns
- simple measure divisions
- keyboard recording
- repetition
- reflection

### Grade 3
- 16-step sequencing
- rhythmic fractions
- tempo
- call-and-response
- curated key mapping

### Grade 4
- programmable mappings
- octave
- waveform
- record → quantize
- rhythmic density comparison

### Grade 5
- full keyboard programming
- synthesis design
- percussion arrangement
- quantization
- tempo/form decisions
- evidence-based revision

## Friendly voices

Available local guides:

- Sunny ☀️
- Rhythm Sage 🦉
- Bloom 🌼
- Rainbow Friend 🌈

Speech uses browser `SpeechSynthesis`.

## Local persistence

Storage key:

`the_refrain_sound_rhythm_lab_k5_v1`

Saved content includes:

- grade
- BPM
- grid division
- waveform
- keyboard mapping
- sequencer grid
- latest keyboard take
- reflections
- saved compositions
- voice settings

## Export

Session export:

`sound-rhythm-lab-session.json`

## Privacy / sovereignty

The app uses only:

- HTML
- CSS
- vanilla JavaScript
- Web Audio API
- Canvas
- SpeechSynthesis
- localStorage
- Blob export
- browser printing

No:

- external libraries
- audio sample CDN
- trackers
- analytics
- advertisements
- cloud accounts
- remote AI
- microphone
- third-party audio storage
- `eval()`
- `Function()`

## Keyboard safety logic

Global keyboard shortcuts are ignored while focus is inside:

- input
- textarea
- select

This prevents musical notes from firing while a learner is typing an explanation or changing a setting.

Repeated `keydown` auto-repeat is also suppressed by tracking pressed keys.

## Design principle

**Children can learn music, fractions, patterns, computing, and systems thinking through one instrument they are allowed to reprogram.**

Copyright © 2026 Jennifer Kay Pearl. All Rights Reserved.
