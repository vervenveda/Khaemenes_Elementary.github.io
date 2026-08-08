# Time Traveler Clock Lab 🕰️

**Khaemenes Elementary · Second Grade · Weeks 11 & 24**

Time Traveler Clock Lab is a sovereign, sandboxed, dependency-free second-grade learning game focused on **analog clocks, elapsed time, schedules, calendars, and daily routine sequencing**.

The central learning cycle is:

> **Plan it → Set it → Travel through time → Check it → Explain it**

The app combines mathematical time concepts with practical planning skills.

---

## Inspiration from Daily Spark™ Task Studio

Time Traveler Clock Lab borrows the strongest architectural ideas from the ProReSources **Daily Spark™ Quantum Focus Studio**, especially:

- Local-first task storage
- Visible time estimates
- A focus-time mindset
- Planner views
- Calendar views
- Progress tracking
- Templates / routines
- Printing
- Export / backup
- Transparent recommendations rather than hidden behavior

Daily Spark itself describes its workspace as a private, local-first task, planning, focus, reminder, and progress studio. Its interface includes a focus timer, Today, Decide Next, Planner, Progress, Templates, and Settings views, plus task creation, due/scheduled dates, time estimates, energy/capacity thinking, completion tracking, calendar activity, export, and print support.

Time Traveler Clock Lab does **not** copy Daily Spark's adult productivity workflow directly. Instead, those ideas are translated into second-grade learning mechanics.

---

## Core Learning Modes

### Set the Clock

Learners manipulate an analog clock to match a requested time.

Difficulty can progress through:

- Hour
- Half hour
- Quarter hour
- Five-minute increments

### How Long Until?

Learners start from one time and travel forward by a specified duration.

Example:

```text
Start: 8:15 AM
Travel forward: 45 minutes
End: 9:00 AM
```

### Schedule Challenge

Learners read a daily schedule and identify the next activity or its time.

### Mixed Time Travel

Clock reading, elapsed time, and schedule problems rotate automatically.

---

## Manipulable Analog Clock

The clock includes:

- Draggable hour hand
- Draggable minute hand
- Hour forward/back controls
- Minute forward/back controls
- Configurable snap intervals
- Digital readout
- Show Me support
- Friendly hints

Snap choices include:

- 30 minutes
- 15 minutes
- 5 minutes

---

## My Day Planner

The planner translates task-management ideas into age-appropriate schedule building.

Learners can:

- Add an activity
- Choose its start time
- Estimate its duration
- Sort activities by time
- Move an activity earlier
- Delete an activity
- Load a school-day template
- Save the full schedule locally
- Print the schedule

This turns the abstract idea of time into a real day.

---

## Calendar Quest

The calendar workspace supports:

- Month navigation
- Selecting dates
- Adding a short event to a date
- Saving events locally
- Calendar puzzles
- Days-later reasoning

Example:

```text
If today is Tuesday, what date is 4 days later?
```

---

## Routine Sequencing

Learners put familiar daily events in chronological order.

This reinforces:

- First
- Next
- Then
- Last
- Earlier
- Later

---

## Adaptive Monte Carlo Engine

Time Traveler Clock Lab includes a local Monte Carlo-style adaptive engine.

It tracks confidence estimates for:

- Clock reading
- Elapsed time
- Schedules
- Calendar reasoning

The engine:

1. Estimates success probability for candidate levels.
2. Simulates candidate outcomes locally.
3. Compares those results with a productive-practice target.
4. Selects a level near approximately:

```text
72% estimated success
```

The app visibly reports:

- Estimated success
- Candidate simulation count
- Selected level
- Target skill

No remote AI service is used.

---

## Friendly Voice Standard

Time Traveler Clock Lab uses only friendly child-facing guide personalities:

- **Sunny** ☀️ — warm and clear
- **Time Sage** 🦉 — calm and thoughtful
- **Bloom** 🌼 — gentle and encouraging
- **Rainbow Friend** 🌈 — cheerful without being loud

The voice layer:

- Uses local browser `SpeechSynthesis`
- Prefers clear English voices
- Rejects common novelty/effect voice labels when possible
- Provides Slow & Clear, Gentle, and A Little Lively pacing
- Includes Preview, Repeat, and Stop
- Stops speaking when narration is switched off or the page is left
- Never records audio
- Never uploads audio
- Requires no outside voice service

---

## Saving

The application automatically saves meaningful progress under:

```text
khaemenes_time_traveler_clock_lab_v1
```

Saved data may include:

- Current clock time
- Mode
- Difficulty
- Snap interval
- Current challenge
- Correct answers
- Streak
- Mastery estimate
- Skill-confidence estimates
- Schedule
- Calendar events
- Voice preferences
- Recent history
- Adaptive state

---

## Export Session JSON

The complete session can be exported as:

```text
time-traveler-clock-lab-session.json
```

This provides a portable local backup.

---

## Printing / Save as PDF

The print layout includes:

- Current challenge
- Analog clock
- Daily planner
- Calendar
- Routine sequencing

Navigation and side controls are removed in print mode.

---

## Sovereign / Sandboxed Design

The app uses only:

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`
- Browser `SpeechSynthesis`
- Browser Blob/Object URL APIs for explicit export

It does **not** use:

- External JavaScript libraries
- External CSS libraries
- External fonts
- APIs
- Analytics
- Trackers
- Advertisements
- Cloud accounts
- Remote AI
- Third-party storage
- `eval()`
- `Function()`

The application can run as one standalone `index.html`.

---

## Privacy

Time Traveler Clock Lab does not require:

- Student name
- Email
- Address
- Exact birth date
- Photograph
- Camera
- Microphone recording
- Account
- Login

All progress remains on the device unless the user explicitly exports a session.

---

## Week 11 Alignment

Week 11 can emphasize:

- Reading analog clocks
- Hour and half hour
- Quarter hour
- Five-minute intervals
- Matching digital and analog time
- Daily routine order

---

## Week 24 Alignment

Week 24 can emphasize:

- Elapsed time
- Schedules
- Calendar navigation
- Days forward/back
- Event planning
- Time between activities

---

## Recommended Repository Location

```text
Khaemenes_Elementary/
└── games/
    └── time-traveler-clock-lab/
        ├── index.html
        └── README.md
```

---

## Design Principles

1. **Time should be manipulated, not merely memorized.**
2. **Schedules make time meaningful.**
3. **Elapsed time should be visual and explainable.**
4. **Calendar work should connect to real events.**
5. **Planning is a practical math skill.**
6. **Adaptive logic should remain visible.**
7. **Hints should support reasoning rather than reveal immediately.**
8. **Everything important should be saveable and printable.**
9. **Voice should always remain friendly and optional.**
10. **No unnecessary data should leave the device.**

---

## Ownership

Time Traveler Clock Lab is part of the Khaemenes Academy / Verve N Veda educational ecosystem.

Copyright © 2026 Jennifer Kay Pearl.  
All Rights Reserved.
