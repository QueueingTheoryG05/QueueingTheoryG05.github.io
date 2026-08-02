<p align="center">
  <img src="logo.svg" alt="Queueing Theory G05 presentation logo" width="110">
</p>

<h1 align="center">Optimizing Matching Time Intervals for Ride-Hailing Services</h1>

<p align="center">
  An interactive Queueing Theory presentation of delayed ride-hailing matching controlled by reinforcement learning
</p>

<p align="center">
  <a href="https://QueueingTheoryG05.github.io/QueueingTheoryG05/">Open Live Presentation</a>
  ·
  <a href="https://github.com/QueueingTheoryG05/QueueingTheoryG05">Repository</a>
  ·
  <a href="paper.pdf">Source Paper</a>
</p>

---

## Overview

An interactive academic presentation explaining how a ride-hailing platform can choose **when to match passengers and drivers** rather than matching every request immediately.

This repository contains a responsive, browser-based presentation based on the paper **Optimizing Matching Time Intervals for Ride-Hailing Services Using Reinforcement Learning**.

The presentation begins with familiar queueing models, introduces the double-ended queue, specializes it to passenger–driver matching, explains the delayed-matching trade-off, and then develops the reinforcement-learning control framework used in the paper.

The current version contains **29 slides** and is designed to remain visually consistent across desktop, laptop, tablet and mobile displays.

## Features

- Responsive browser-based academic presentation with **29 slides**
- Structured introduction to classical queueing models and double-ended queues
- Direct comparison between double-ended queues and familiar \(M/M/m\) models
- Ride-hailing interpretation with passenger and driver matching queues
- Delayed-matching control, evaluation metrics and the U-shaped waiting-cost trade-off
- Introductory explanation of reinforcement learning, state, action, reward and policy
- Policy Gradient, REINFORCE, Actor-Critic and ACER coverage
- Real-data experiments, result tables, policy interpretation and limitations
- Adaptive desktop viewer scaling and native mobile viewport support
- Locally hosted MathJax for mathematical notation
- Interactive slide overview and direct navigation
- Browser fullscreen presentation mode
- Expandable paper figures and diagrams
- Keyboard, mouse-wheel and mobile swipe navigation
- Direct links to individual slides through URL hashes
- Live slide counters and progress indicators
- PowerPoint-style slide transitions based on stable shared presentation anchors
- Geometric card-hover motion with stable hit areas and no hover oscillation
- Custom desktop presentation cursor without a distracting glow layer
- Dedicated mobile navigation controls
- Runtime typography, layout and interaction refinements
- No framework, package manager or compilation process required
- Suitable for direct deployment through GitHub Pages

## Presentation Structure

| Chapter | Slide range | Number of slides |
|:--|:--:|--:|
| Opening | 1 | 1 |
| Overview | 2 | 1 |
| Queueing Foundations | 3 | 1 |
| Double-Ended Queue | 4–5 | 2 |
| Correspondence | 6 | 1 |
| Differences | 7 | 1 |
| Applications | 8 | 1 |
| Ride-Hailing Model | 9 | 1 |
| Delayed Matching | 10 | 1 |
| Metrics | 11–12 | 2 |
| Fixed Interval | 13 | 1 |
| Non-Stationary System | 14 | 1 |
| Why RL? | 15 | 1 |
| Mechanism | 16–17 | 2 |
| RL Primer | 18 | 1 |
| Formal Setup | 19 | 1 |
| RL Control | 20 | 1 |
| Evidence | 21–25 | 5 |
| Interpretation | 26 | 1 |
| Assessment | 27 | 1 |
| Closing | 28–29 | 2 |

## Running the Presentation

No installation, npm package or build step is required.

### Option 1 — Open directly

Open the file <code>index.html</code> in a modern browser.

### Option 2 — Run through a local server

Running a small local HTTP server is recommended:

<pre><code>python -m http.server 8000</code></pre>

Then open:

<pre><code>http://localhost:8000</code></pre>

The presentation starts from <code>index.html</code>, which loads <code>presentation.html</code> inside the responsive viewer.

## Controls

| Action | Keyboard or gesture |
|:--|:--|
| Next slide | <kbd>Right Arrow</kbd>, <kbd>Down Arrow</kbd>, <kbd>Page Down</kbd>, or <kbd>Space</kbd> |
| Previous slide | <kbd>Left Arrow</kbd>, <kbd>Up Arrow</kbd>, or <kbd>Page Up</kbd> |
| First slide | <kbd>Home</kbd> |
| Last slide | <kbd>End</kbd> |
| Slide overview | <kbd>O</kbd> |
| Fullscreen | <kbd>F</kbd> |
| Close overview, image, or fullscreen | <kbd>Esc</kbd> |
| Desktop navigation | Mouse wheel |
| Mobile navigation | Horizontal swipe |
| Open a figure | Click or press <kbd>Enter</kbd> on a presentation image |

The Previous, Next and Overview controls are also available directly in the mobile interface when the mobile navigation enhancement is enabled.

## Project Structure

<pre><code>.
├── index.html                           # Outer responsive viewer and adaptive desktop scaling
├── presentation.html                    # Presentation content and 31-slide HTML structure
├── reference-base.css                   # Shared visual foundation and desktop presentation styles
├── reference-mobile.css                 # Base mobile presentation rules
├── queue.css                            # Queueing Theory layouts and final visual overrides
├── ideal-enhancements.css               # Additional responsive and interaction refinements
├── mobile-viewer.css                    # Mobile rules for the outer viewer
├── project1-transition.css              # PowerPoint-style slide-transition visual rules
├── presentation-cursor.css              # Custom desktop presentation cursor
├── script.js                            # Navigation, overview, fullscreen, hashes and image lightbox
├── ideal-enhancements.js                # Runtime presentation refinements
├── mobile-presentation.js               # Mobile presentation controls and gestures
├── project1-transition.js               # Slide-transition anchor assignment
├── project1-transition-stability.js     # Transition conflict and nested-anchor prevention
├── smooth-geometric-hover.js            # Stable geometric card hover without oscillation
├── presentation-cursor.js               # Custom desktop cursor behaviour
├── assets/                              # Paper figures, diagrams and presentation images
├── vendor/mathjax/                      # Locally hosted MathJax distribution
├── logo.svg                             # Queueing Theory presentation logo
├── favicon.svg                          # Browser favicon
├── paper.pdf                            # Local repository copy of the source paper
└── README.md                            # Project documentation</code></pre>

## Technical Stack

- Semantic HTML5
- Responsive CSS
- Vanilla JavaScript
- CSS Grid and Flexbox
- View Transitions API with a browser fallback
- Web Animations API
- Local MathJax rendering
- GitHub Pages
- No external JavaScript framework
- No package manager or compilation step

## Source Paper

**Optimizing Matching Time Intervals for Ride-Hailing Services Using Reinforcement Learning**

- **Authors:** Guoyang Qin, Qi Luo, Yafeng Yin, Jian Sun and Jieping Ye
- **Publication:** Transportation Research Part C: Emerging Technologies
- **Year:** 2021
- **DOI:** [10.1016/j.trc.2021.103239](https://doi.org/10.1016/j.trc.2021.103239)
- **Repository copy:** [paper.pdf](paper.pdf)

## Academic Context

- **Presented by:** Ghazal Zolfi Moselo
- **Co-presenter:** MohammadMahdi Montazeri Hedesh
- **Course instructor:** Prof. Maryam Radman
- **Group:** G05
- **Course:** Queueing Theory
- **Course area:** Queueing Theory and Operations Research

## Deployment

The repository is suitable for direct deployment through GitHub Pages.

The production entry point is:

<pre><code>index.html</code></pre>

The outer viewer preserves a stable presentation scale on desktop and laptop displays, while the internal presentation uses the device-native viewport on mobile screens.

The deployed presentation is available from:

<https://QueueingTheoryG05.github.io/QueueingTheoryG05/>

## Development Notes

- Keep all slide content and slide metadata inside <code>presentation.html</code>.
- Keep the outer responsive viewer and iframe scaling logic inside <code>index.html</code>.
- Keep shared presentation styling inside <code>reference-base.css</code>.
- Keep mobile foundation rules inside <code>reference-mobile.css</code>.
- Keep Queueing Theory layouts and final overrides inside <code>queue.css</code>.
- Keep slide navigation, overview, fullscreen, hash state and image-lightbox logic inside <code>script.js</code>.
- Keep transition-specific behaviour inside the <code>project1-transition</code> files.
- Keep hover geometry inside <code>smooth-geometric-hover.js</code> and avoid adding competing hover transforms elsewhere.
- Keep presentation figures, diagrams and result images inside <code>assets</code>.
- Preserve stable and unique slide IDs.
- Preserve the <code>data-chapter</code> and <code>data-title</code> attributes used by navigation and the slide overview.
- When inserting or removing slides, verify slide counters, URL hashes, chapter ranges and any <code>data-go</code> navigation targets.
- Avoid assigning the same View Transition name to multiple elements in one active slide.
- Avoid nesting independent transition anchors inside one another.
- Test card hover behaviour after changing <code>transform</code>, <code>translate</code>, <code>scale</code>, borders or grid sizing.
- Test every visual change in desktop, mobile, overview, fullscreen and image-lightbox modes.
- Use a hard refresh after changing versioned CSS or JavaScript assets.

## Repository

[QueueingTheoryG05](https://github.com/QueueingTheoryG05/QueueingTheoryG05)
