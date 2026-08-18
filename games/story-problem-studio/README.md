# Story Problem Studio 📖➕

**Khaemenes Elementary · Second Grade · Mathematics + Language Arts**

Story Problem Studio is a dependency-free learning app designed to help 1st-5th grade learners **read, visualize, solve, explain, create, save, draw, and print mathematical story problems**.

Its central learning cycle is:

> **Read it → Picture it → Solve it → Explain it → Create it**

The application combines mathematical reasoning with reading comprehension, vocabulary, oral language, writing, and visual representation.

---

## Core Features

### Solve Illustrated Story Problems

Story Problem Studio dynamically generates addition and subtraction situations using changing:

- Characters
- Objects
- Number values
- Unknown positions
- Operations
- Difficulty levels

The application supports three major story structures:

- **Result unknown**
- **Change unknown**
- **Start unknown**

Examples:

```text
12 + 7 = ?
12 + ? = 19
? + 7 = 19
```

and corresponding subtraction structures.

---

## Draw My Thinking Canvas

Learners can represent their reasoning using the built-in drawing canvas.

They may draw:

- Objects
- Tally marks
- Number bonds
- Bar models
- Circles
- Groups
- Equations
- Labels
- Their own visual strategies

The canvas supports:

- Pen color
- Pen size
- Eraser
- Clear canvas
- Local auto-save
- Manual local save
- PNG export
- Printing

The drawing never leaves the device unless the user explicitly exports it.

---

## Create a Problem

Learners may create their own mathematical stories by choosing:

- Character
- Object
- Addition or subtraction
- Unknown position
- Starting quantity
- Change quantity

The program converts those choices into a complete mathematical story and equation.

Created stories can be:

- Previewed
- Saved locally
- Loaded into the solver
- Included in session history
- Printed

This supports both **mathematics** and **language arts** by asking learners to think about story structure, sequence, action, vocabulary, and mathematical meaning.

---

## Language Lab

The Language Lab decomposes each story into:

- **Who?**
- **What happened?**
- **What do we know?**
- **What are we finding?**

It also includes:

- Sentence frames
- Math vocabulary
- Read-aloud support

This is intended to help learners understand that word-problem success depends on comprehending the situation rather than merely searching for key words.

---

## Adaptive Monte Carlo Engine

Story Problem Studio includes a local Monte Carlo-style adaptive challenge selector.

It does not call a remote AI service.

The engine evaluates candidate combinations of:

- Addition or subtraction
- Result/change/start unknown
- Number difficulty
- Recent learner success
- Current skill-confidence estimates
- Current mastery estimate

It performs local simulations and chooses a challenge near a productive-success target of approximately:

```text
72%
```

This is intended to keep practice neither consistently trivial nor consistently discouraging.

The interface displays:

- Estimated success
- Candidate simulations
- Selected level
- Target story structure

The adaptive process is intentionally visible and explainable.

---

## Saving and Printing

Story Problem Studio is designed so that **all meaningful work can be preserved**.

### Automatic Local Saving

The app automatically saves:

- Current generated problem
- Created problem
- Correct-answer count
- Created-story count
- Streak
- Mastery estimate
- Skill-confidence estimates
- Recent history
- Adaptive state
- Mode settings
- Sound preference
- Creator settings

The main application state is stored under:

```text
khaemenes_story_problem_studio_v2
```

The drawing canvas is stored separately under:

```text
khaemenes_story_problem_studio_canvas_v1
```

### Manual Save

The **Save Session** button explicitly saves the current application state.

### Export Session JSON

The complete session can be exported as:

```text
story-problem-studio-session.json
```

The export includes:

- App metadata
- Timestamp
- Progress
- Skill data
- Current problem
- Created problem
- History
- Creator state
- Drawing image data

This provides a portable local backup without requiring a server.

### Save Drawing PNG

The learner's canvas can be exported as:

```text
story-problem-thinking.png
```

### Print / Save PDF

The built-in print stylesheet prepares:

- Current story problem
- Illustration
- Equation
- Answer area
- Drawing canvas
- Created problem section
- Language Lab

for browser printing or **Save as PDF**.

---

## Sovereign / Sandboxed Design

Story Problem Studio is built entirely with:

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`
- Browser Canvas API
- Browser `SpeechSynthesis`
- Browser Blob/Object URL APIs for explicit exports

It does **not** require:

- JavaScript frameworks
- External CSS
- External fonts
- APIs
- Trackers
- Analytics
- Advertisements
- Accounts
- Cloud services
- Remote AI
- Third-party storage
- `eval()`
- `Function()`

The app can operate as a single local HTML file.

---

## Privacy

Story Problem Studio does not require:

- Student name
- Email
- Address
- Exact birth date
- Photograph
- Microphone recording
- Camera
- Account
- Login

Progress remains in the browser unless the user explicitly chooses to export it.

---

## Read-Aloud Support

When browser speech synthesis is available, the app can:

- Read story problems
- Read hints
- Explain the problem structure
- Read the first reasoning step
- Provide brief answer feedback

Speech can be disabled at any time.

No audio is recorded or transmitted.

---

## Second-Grade Learning Goals

Story Problem Studio supports practice in:

### Mathematics

- Addition within second-grade ranges
- Subtraction within second-grade ranges
- Word-problem interpretation
- Unknown-position flexibility
- Modeling
- Mathematical representation
- Explaining reasoning
- Selecting operations based on situation

### Language Arts

- Reading comprehension
- Narrative sequencing
- Vocabulary
- Question interpretation
- Oral language
- Sentence structure
- Writing mathematical stories
- Identifying known and unknown information

---

## Why Unknown Position Matters

Many children learn to assume that the question mark always belongs at the end:

```text
12 + 7 = ?
```

Story Problem Studio intentionally includes:

```text
12 + ? = 19
? + 7 = 19
```

and equivalent subtraction structures.

This encourages relational thinking and reduces dependence on superficial key-word strategies.

---

## Accessibility

The application includes:

- Large touch targets
- Visible focus states
- Responsive layout
- Keyboard-accessible controls
- Reduced-motion support
- Read-aloud support
- Visual illustrations
- Drawing-based response options
- Text and visual representations together
- Unlimited retries
- No punitive failure state

---

## Recommended Repository Location

Suggested structure:

```text
Khaemenes_Elementary/
└── games/
    └── story-problem-studio/
        ├── index.html
        └── README.md
```

It may also be placed under a second-grade mathematics or interdisciplinary game directory.

---

## Curriculum Integration

Story Problem Studio is designed to appear throughout the second-grade year rather than in a single isolated unit.

Appropriate curriculum connections include:

- Addition
- Subtraction
- Place value
- Multi-step reasoning preparation
- Mathematical language
- Writing
- Reading comprehension
- Modeling
- Explaining thinking

Potential future launch parameters could include:

```text
?operation=add
?unknown=change
?level=2
```

while preserving local-first behavior.

---

## Design Principles

1. **Understand the story before choosing an operation.**
2. **Drawings are mathematical thinking.**
3. **Unknowns can appear anywhere.**
4. **Creating a problem is a form of mastery.**
5. **Language and mathematics reinforce one another.**
6. **Adaptation should be explainable.**
7. **Incorrect answers should trigger support, not punishment.**
8. **Student work should be saveable and printable.**
9. **No unnecessary data should leave the device.**
10. **The app should remain dependency-free and inspectable.**

---

## Development Roadmap

Potential future additions:

- Two-step story problems
- Comparison problem structures
- Equal-groups preparation
- Money story problems
- Measurement story problems
- Time story problems
- Bar-model templates
- Number-line drawing aid
- Printable story-problem portfolio
- Teacher-created prompt sets
- Shared Khaemenes learner-profile bridge
- NAIB mentor adapter
- Curriculum launch parameters
- Second-grade game-hub integration

---

## Ownership

Story Problem Studio is part of the Khaemenes Academy / Verve N Veda educational ecosystem.

Copyright © 2026 Jennifer Kay Pearl.  
All Rights Reserved.
