# Ride-Hailing Matching Intervals — Queueing Theory Presentation

A self-contained academic slide website based on the paper **“Optimizing Matching Time Intervals for Ride-Hailing Services Using Reinforcement Learning.”**

## Run locally

No Node.js, npm, build step, or internet connection is required.

1. Extract the ZIP file.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.

For a local web-server URL instead of opening the file directly:

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
- Vertical scrolling remains available on mobile when a slide is taller than the screen

## Contents

- `index.html` — main entry point
- `presentation.html` — duplicate presentation entry for compatibility
- `queue.css` — queueing presentation layouts and final visual overrides
- `reference-base.css` / `reference-mobile.css` — visual foundation from the reference presentation
- `script.js` — navigation, progress, URL state, fullscreen, and swipe controls
- `assets/` — figures cropped from the paper
- `vendor/mathjax/` — local MathJax renderer for LaTeX equations
- `paper.pdf` — source paper opened by the Paper button

The desktop presentation automatically fits the full laptop viewport at browser zoom 100%, while preserving one stable layout scale. All visible presentation typography uses Times New Roman. Mathematical notation is rendered from LaTeX through the included local MathJax file.


Navigation includes keyboard controls, fullscreen mode, and a slide Overview panel.

## V6 display controls

- The desktop canvas is fixed at 1440×810 and automatically fitted to each laptop viewport at the default 100% presentation scale.
- Use the visible − / 100% / + controls for presentation zoom.
- Use Overview or Fullscreen from the footer; keyboard shortcuts O and F remain available.
