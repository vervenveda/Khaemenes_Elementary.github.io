# Math Market 🛒

**Khaemenes Elementary · Second Grade · Mathematics + Economics**

Math Market is a dependency-free classroom market simulation that helps second-grade learners apply mathematics to real-world economic decisions.

The core cycle is:

> **Choose → Count → Pay → Compare → Budget → Explain → Build**

The app is designed for direct use during second-grade mathematics and social-studies/economics instruction, including the entrepreneurship work planned for Week 32.

---

## Curriculum Connections

Math Market is especially suited to:

- **Week 4** — counting money and recognizing values
- **Week 10** — addition/subtraction in real contexts
- **Week 22** — budgeting, needs/wants, and consumer choices
- **Week 32** — entrepreneurship, producers/consumers, revenue, cost, and profit

It can also be revisited throughout the year as an interdisciplinary mathematics + economics practice environment.

---

## Core Features

### Virtual Classroom Market

Learners shop from a rotating market containing products such as:

- Apples
- Bread
- Milk
- Books
- Crayons
- Soap
- Balls
- Flowers
- Pencils

Each product includes:

- Price
- Product icon
- Need/want context
- Producer information

---

## Market Modes

### Shopping

The learner chooses the correct product and pays the exact amount.

### Make Change

A customer pays with a larger amount, and the learner builds the correct change.

### Budget Challenge

The learner receives a fixed budget and must choose at least two items without overspending.

### Mixed Market

Shopping, change, and budgeting challenges rotate automatically.

---

## Money Lab

The built-in Money Lab includes:

- 1¢
- 5¢
- 10¢
- 25¢
- $1
- $5

Learners tap coins and bills to build a payment.

The display can show:

- Cents
- Dollars and cents

The app tracks the current payment, basket total, wallet value, and challenge requirement.

---

## Needs and Wants

Math Market includes a dedicated Needs & Wants workspace.

Learners may classify products as:

- Need
- Want
- Depends

The app intentionally allows context-sensitive reasoning.

The goal is not merely to memorize labels but to explain why a product may be necessary, optional, or dependent on circumstances.

---

## Producers and Consumers

The economics workspace introduces:

### Producer

A person or organization that creates or provides a good or service.

### Consumer

A person who buys or uses a good or service.

The app can generate short questions using current market products.

---

## Week 32 Entrepreneurship Lab

The Tiny Business Builder allows learners to create a simple business.

Learners choose:

- Business name
- Product
- Selling price
- Cost to make
- Number sold
- Need/want classification

The app calculates:

```text
Revenue = Price × Quantity Sold
Total Cost = Cost Per Item × Quantity Sold
Profit = Revenue − Total Cost
```

This makes Math Market directly usable for an entrepreneurship unit.

---

## Adaptive Monte Carlo Engine

Math Market includes a local Monte Carlo-style adaptive challenge selector.

No remote AI or API is used.

The engine tracks confidence estimates for:

- Counting money
- Making change
- Budgeting
- Economics concepts

It then:

1. Estimates success probability for candidate challenge levels.
2. Simulates possible learner outcomes locally.
3. Compares those results with a productive-practice target.
4. Selects the level expected to provide useful challenge.

The target success zone is approximately:

```text
72%
```

The app displays:

- Estimated success
- Candidate simulation count
- Selected level
- Target skill

Adaptation is therefore visible rather than hidden.

---

## Saving

Math Market automatically saves meaningful state locally.

The main storage key is:

```text
khaemenes_math_market_v1
```

Saved information may include:

- Current mode
- Difficulty setting
- Money display preference
- Wallet
- Basket
- Payment
- Current challenge
- Correct answers
- Sales
- Streak
- Mastery estimate
- Skill-confidence estimates
- Recent history
- Needs/wants choices
- Business plan
- Sound preference
- Adaptive state

---

## Manual Save

The **Save Session** button explicitly saves the current state.

---

## Export Session JSON

The complete session can be exported as:

```text
math-market-session.json
```

This provides a portable local backup without requiring an account or cloud service.

---

## Printing / Save as PDF

Math Market contains a print stylesheet.

The browser can print or save as PDF:

- Current challenge
- Market products
- Basket
- Money Lab
- Needs & Wants work
- Producers & Consumers information
- Entrepreneurship plan

Navigation and progress-sidebars are hidden in the print version.

---

## Sovereign / Sandboxed Design

Math Market uses only:

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
- Network APIs
- Analytics
- Trackers
- Advertising
- Cloud storage
- Remote AI
- Third-party authentication
- `eval()`
- `Function()`

The application can run entirely as one standalone local HTML file.

---

## Privacy

Math Market does not require:

- Student name
- Email
- Address
- Exact birth date
- Photograph
- Camera
- Microphone recording
- Account
- Login

Progress remains on the device unless the user explicitly exports a session.

---

## Friendly Voice Standard

Math Market uses the same friendly-guide voice architecture established across the Khaemenes second-grade game family.

Available guide personalities are:

- **Sunny** ☀️ — warm and clear
- **Market Sage** 🦉 — calm and thoughtful
- **Bloom** 🌼 — gentle and encouraging
- **Rainbow Friend** 🌈 — cheerful without being loud

The voice system:

- Uses only local browser `SpeechSynthesis`
- Prefers clear English voices already available on the learner's device
- Rejects common novelty/effect-style voice names when possible
- Provides Slow & Clear, Gentle, and A Little Lively pacing
- Provides Preview, Repeat, and Stop controls
- Stops speaking when read-aloud is turned off or the page is left
- Uses supportive, non-punitive spoken feedback
- Never records or uploads audio
- Requires no remote voice service or external dependency

Because browser and operating-system voice catalogs differ, Math Market does not depend on a single proprietary voice. Each guide controls pacing, pitch, wording, and preferred local voice families while still falling back safely to a local English voice.

---

## Read-Aloud Support

When browser speech synthesis is available, the app can read:

- Current challenge
- Market Guide instructions
- First-step support
- Hints
- Basic feedback

Speech may be disabled at any time.

No recorded audio is created or uploaded.

---

## Second-Grade Mathematics Skills

Math Market supports:

- Counting coins
- Counting bills
- Combining monetary values
- Addition
- Subtraction
- Exact payment
- Making change
- Comparing prices
- Budgeting
- Repeated addition preparation
- Revenue and cost calculations
- Early profit reasoning

---

## Economics Skills

Math Market introduces:

- Needs
- Wants
- Goods
- Producers
- Consumers
- Prices
- Budgets
- Spending choices
- Revenue
- Costs
- Profit
- Entrepreneurship

---

## Accessibility

The application includes:

- Large touch targets
- Visible focus states
- Responsive layout
- Reduced-motion support
- Read-aloud support
- Text and icon representations
- Unlimited retries
- Non-punitive feedback
- Manual difficulty override

---

## Recommended Repository Location

Suggested structure:

```text
Khaemenes_Elementary/
└── games/
    └── math-market/
        ├── index.html
        └── README.md
```

---

## Design Principles

1. **Money should be handled, not merely memorized.**
2. **Economic vocabulary should appear inside meaningful decisions.**
3. **Budgets teach tradeoffs, not deprivation.**
4. **Needs and wants can involve context and discussion.**
5. **Entrepreneurship should connect math to creativity and service.**
6. **Incorrect answers should lead to guidance, not punishment.**
7. **Adaptation should remain explainable.**
8. **Everything important should be saveable and printable.**
9. **No unnecessary student data should leave the device.**
10. **The application should remain dependency-free and inspectable.**

---

## Potential Future Enhancements

- Customer role-play mode
- Classroom jobs and wages
- Savings goals
- Sales tax mode for older students
- Receipt printing
- Teacher-created product sets
- Seasonal market themes
- Bar graphs of sales
- Inventory tracking
- Shared Khaemenes learner-profile bridge
- NAIB mentor adapter
- Curriculum launch parameters
- Week 32 entrepreneurship portfolio export
- Second-grade economics game-hub integration

---

## Ownership

Math Market is part of the Khaemenes Academy / Verve N Veda educational ecosystem.

Copyright © 2026 Jennifer Kay Pearl.  
All Rights Reserved.
