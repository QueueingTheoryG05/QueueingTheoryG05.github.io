# Ride-Hailing Matching Intervals — Queueing Theory Presentation

A self-contained academic slide website based on the paper **“Optimizing Matching Time Intervals for Ride-Hailing Services Using Reinforcement Learning.”**

## Run locally

No Node.js, npm, build step, or internet connection is required.

1. Extract the ZIP file.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.

For a local web-server URL:

```bash
cd ride_hailing_queue_presentation
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Controls

- `←` / `→`: previous or next slide
- `Page Up` / `Page Down`: previous or next slide
- `Home` / `End`: first or last slide
- `O`: open the slide Overview
- `F`: fullscreen
- Click any paper figure to open the complete image viewer
- Swipe horizontally on mobile to navigate

## Interaction

- Desktop uses a chapter-aware glowing pointer whose colour changes with the presentation section.
- Cards and figure frames use subtle hover movement, border-colour changes, and a cursor-position highlight.
- Pointer and hover motion are disabled automatically on touch devices and reduced-motion systems.

## Contents

- `index.html` — responsive outer viewer
- `presentation.html` — presentation content
- `queue.css` — queueing layouts, typography, and hover styling
- `presentation-cursor.css` / `presentation-cursor.js` — adaptive coloured presentation pointer
- `morph-hover.js` — cursor-position hover highlighting for cards
- `reference-base.css` / `reference-mobile.css` — visual foundation from the reference presentation
- `script.js` — navigation, progress, URL state, fullscreen, image viewer, and swipe controls
- `assets/` — figures extracted from the paper
- `vendor/mathjax/` — local MathJax renderer for LaTeX equations
- `paper.pdf` — source paper opened by the Paper button

The desktop presentation automatically fits the full laptop viewport at browser zoom 100%, while preserving a stable layout scale. All visible presentation typography uses Times New Roman.
