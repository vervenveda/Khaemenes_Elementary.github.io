Number Forge 🔨

Khaemenes Elementary · Second Grade Mathematics

Number Forge is a dependency-free mathematics game designed to help second-grade learners understand place value, regrouping, addition, and subtraction through visual base-ten manipulation.

The core design principle is simple:

Build it before you solve it.

Rather than treating regrouping as a memorized written procedure, Number Forge lets learners manipulate hundreds, tens, and ones directly. Ten ones can be forged into one ten. One ten can be broken apart into ten ones. Ten tens can be forged into one hundred. One hundred can be decomposed into ten tens.

Educational Purpose

Number Forge is designed for second-grade mathematics practice involving:

Hundreds, tens, and ones

Standard form

Expanded form

Number words

Base-ten representation

Addition within 1,000

Subtraction within 1,000

Visual regrouping

Composing and decomposing units

Mathematical reasoning

Checking an answer with a concrete model

The game is intended as a supplemental instructional tool, not as a replacement for teacher instruction, manipulatives, written work, or mathematical discussion.

Core Game Modes

Build a Number

The learner is shown a number such as:

347

and constructs it using:

3 hundred flats

4 ten rods

7 one cubes

Addition

The learner models an addition problem using the forge.

Example:

268 + 157

The learner can regroup:

10 ones → 1 ten
10 tens → 1 hundred

before entering the final answer.

Subtraction

The learner models subtraction and may decompose larger units:

1 hundred → 10 tens
1 ten → 10 ones

to make subtraction possible.

Mixed Forge

Build, addition, and subtraction challenges are mixed automatically.

Number Representations

Number Forge supports:

Standard form — 472

Expanded form — 400 + 70 + 2

Number words — four hundred seventy-two

This helps the learner connect multiple representations of the same quantity.

Visual Base-Ten Forge

The interface contains three place-value chambers:

Hundreds | Tens | Ones

Each chamber contains a visual base-ten representation:

Hundred flat = 100

Ten rod = 10

One cube = 1

Learners may:

Add blocks

Remove blocks

Drag blocks between columns

Regroup 10 ones into 1 ten

Decompose 1 ten into 10 ones

Regroup 10 tens into 1 hundred

Decompose 1 hundred into 10 tens

Clear the forge

Display the starting number with blocks

Adaptive Monte Carlo Engine

Number Forge includes a local Monte Carlo-style challenge selector.

This is deliberately lightweight and explainable. It does not use an outside AI service.

The engine:

Maintains local confidence estimates for:

Place value

Regrouping

Addition

Subtraction

Estimates the learner's probability of success at each available challenge level.

Simulates candidate outcomes locally.

Selects a challenge near a productive target success rate.

Updates skill confidence after each attempt.

The default productive-practice target is approximately:

72% estimated success

The goal is to avoid both:

work that is consistently too easy, and

work that is consistently discouraging.

The Monte Carlo panel displays:

Estimated success

Number of candidate simulations

Selected level

Selection reason

This keeps adaptation visible rather than hidden.

Adaptive Levels

Level 1 · Foundations

Focus:

Place-value construction

Addition without regrouping

Subtraction without regrouping

Smaller numbers

Level 2 · Regrouping

Focus:

Addition requiring regrouping

Subtraction requiring decomposition

Larger two- and three-digit numbers

Level 3 · Mixed Challenge

Focus:

Mixed place-value demands

Multiple regrouping opportunities

Larger second-grade challenges

Teachers or families may also override adaptive mode and select a level manually.

Sovereign / Sandboxed Design

Number Forge is built as a standalone vanilla application.

It uses:

HTML

CSS

Vanilla JavaScript

Browser localStorage

Browser SpeechSynthesis when available

It does not require:

External JavaScript libraries

External CSS libraries

External fonts

Analytics

Trackers

Advertising

Cloud accounts

APIs

Network calls

Third-party game services

eval()

Function()

Remote AI providers

All game logic executes locally in the browser.

Local Storage

Progress is stored under:

khaemenes_number_forge_v2

The local record may contain:

Correct-answer count

Current streak

Best streak

Recent results

Adaptive level

Mastery estimate

Skill-confidence estimates

Recent problem history

Sound preference

Mode and difficulty preference

The app does not require a learner's:

Name

Email

Address

Exact date of birth

Photograph

Account

Microphone

Camera

A user can erase all Number Forge progress with the Reset control.

Read-Aloud Support

When browser speech synthesis is available, Number Forge can:

Read a challenge aloud

Read the Forge Guide's hint

Read the first step

Give brief success / retry feedback

Speech can be disabled at any time.

No recorded audio is created or uploaded.

Accessibility

The interface includes:

Large touch targets

Keyboard-accessible buttons

Visible focus states

Responsive layouts

Reduced-motion support

Read-aloud support

Text-based instructions in addition to color

Visual place-value representation

Repeated attempts without penalty

Recommended Repository Location

Suggested Khaemenes Elementary structure:

Khaemenes_Elementary/
└── games/
    └── number-forge/
        ├── index.html
        └── README.md

The app can also live under a second-grade-specific directory if the repository uses grade-scoped game organization.

Curriculum Integration

Number Forge is especially appropriate for second-grade units covering:

Place value to 1,000

Comparing and representing three-digit numbers

Addition within 1,000

Subtraction within 1,000

Regrouping

Expanded notation

Base-ten reasoning

A curriculum page can link directly to the game as supplemental practice.

Future versions may optionally accept launch parameters such as:

?mode=add
?level=2
?skill=regroup

provided that the resulting behavior remains local-first and deterministic.

Design Principles

Number Forge follows these principles:

Concrete before abstractLearners see the quantity represented before relying only on written algorithms.

Regrouping should be visibleTen ones becoming one ten should be an observable transformation.

No failure stateIncorrect answers trigger guidance and another attempt.

Adaptation should be explainableThe learner or adult can see why a level was selected.

The game should remain educationalVisual rewards support the mathematics rather than distracting from it.

No unnecessary data collectionProgress is browser-local by default.

No outside dependenciesThe game remains portable, inspectable, and maintainable.

Technical Notes

Number Forge is implemented as a single self-contained index.html.

JavaScript uses:

Strict mode

DOM APIs

localStorage

Native drag-and-drop

SpeechSynthesis

Local pseudo-random simulation for Monte Carlo-style adaptation

The application does not execute user-provided code.

Development Roadmap

Potential future enhancements:

Touch-first drag ghost for tablets

Optional keyboard block controls

Missing-addend challenges

Number comparison mode

Open number-line companion

Written algorithm side-by-side with block model

Teacher-defined challenge ranges

Curriculum launch parameters

Shared Khaemenes profile bridge

NAIB mentor adapter

Printable progress summary

Second-grade mathematics game hub integration

Ownership

Number Forge is part of the Khaemenes Academy / Verve N Veda educational ecosystem.

Copyright © 2026 Jennifer Kay Pearl.All Rights Reserved.
