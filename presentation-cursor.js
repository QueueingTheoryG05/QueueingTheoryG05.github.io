
(() => {
  "use strict";

  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

  if (!finePointer.matches) {
    return;
  }

  /*
    پاک‌کردن عناصر نسخهٔ قبلی در صورت وجود.
  */
  document
    .querySelectorAll(
      ".presentation-pointer, "
      +
      ".presentation-pointer-glow"
    )
    .forEach(
      element => element.remove()
    );

  const root =
    document.documentElement;

  const pointer =
    document.createElement("div");

  pointer.className =
    "presentation-pointer";

  pointer.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.appendChild(
    pointer
  );

  root.classList.add(
    "presentation-pointer-ready"
  );

  const palettes = {
    opening: "255, 84, 112",
    problem: "255, 106, 64",
    "queueing-model": "118, 89, 255",
    simulator: "39, 174, 255",
    "rl-control": "39, 174, 255",
    evidence: "25, 201, 151",
    interpretation: "255, 184, 59",
    assessment: "255, 184, 59",
    closing: "196, 110, 255",
    default: "255, 112, 67"
  };

  let targetX =
    window.innerWidth / 2;

  let targetY =
    window.innerHeight / 2;

  let pointerX = targetX;
  let pointerY = targetY;
  let pointerSize = 7;
  let visible = false;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const normalizeChapter = value =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );

  function applyPalette() {
    const activeSlide =
      document.querySelector(
        ".slide.is-active"
      );

    const chapter =
      normalizeChapter(
        document.body.dataset.chapter
        ||
        activeSlide?.dataset.chapter
      );

    root.style.setProperty(
      "--pointer-rgb",
      palettes[chapter]
      ||
      palettes.default
    );
  }

  function setVisible(state) {
    visible = state;

    pointer.classList.toggle(
      "is-visible",
      state
    );
  }

  function isInteractive(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    return Boolean(
      target.closest(
        [
          "a",
          "button",
          "input",
          "select",
          "textarea",
          "summary",
          "label",
          "[role='button']",
          "[role='link']",
          "[tabindex]:not([tabindex='-1'])",
          ".zoomable-image",
          ".u-morph-hover"
        ].join(",")
      )
    );
  }

  function isTextual(target) {
    if (
      !(target instanceof Element)
      ||
      isInteractive(target)
    ) {
      return false;
    }

    return Boolean(
      target.closest(
        [
          "p",
          "span",
          "li",
          "small",
          "strong",
          "em",
          "code",
          "figcaption",
          "h1",
          "h2",
          "h3",
          "h4",
          "td",
          "th"
        ].join(",")
      )
    );
  }

  function onMove(event) {
    if (
      event.pointerType
      &&
      event.pointerType !== "mouse"
    ) {
      return;
    }

    targetX = event.clientX;
    targetY = event.clientY;

    if (!visible) {
      pointerX = targetX;
      pointerY = targetY;
      setVisible(true);
    }

    pointer.classList.toggle(
      "is-interactive",
      isInteractive(event.target)
    );

    pointer.classList.toggle(
      "is-over-text",
      isTextual(event.target)
    );
  }

  function onDown(event) {
    if (
      event.pointerType
      &&
      event.pointerType !== "mouse"
    ) {
      return;
    }

    pointer.classList.add(
      "is-pressed"
    );
  }

  function onUp() {
    pointer.classList.remove(
      "is-pressed"
    );
  }

  function onLeave() {
    setVisible(false);
    onUp();

    pointer.classList.remove(
      "is-interactive",
      "is-over-text"
    );
  }

  function readSize() {
    pointerSize =
      pointer
        .getBoundingClientRect()
        .width
      ||
      7;
  }

  function animate() {
    const ease =
      reducedMotion
        ? 1
        : 0.54;

    pointerX +=
      (targetX - pointerX)
      *
      ease;

    pointerY +=
      (targetY - pointerY)
      *
      ease;

    readSize();

    pointer.style.transform =
      `translate3d(${
        pointerX - pointerSize / 2
      }px, ${
        pointerY - pointerSize / 2
      }px, 0)`;

    requestAnimationFrame(
      animate
    );
  }

  window.addEventListener(
    "pointermove",
    onMove,
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    onDown,
    { passive: true }
  );

  window.addEventListener(
    "pointerup",
    onUp,
    { passive: true }
  );

  window.addEventListener(
    "pointercancel",
    onUp,
    { passive: true }
  );

  document.documentElement
    .addEventListener(
      "mouseleave",
      onLeave,
      { passive: true }
    );

  window.addEventListener(
    "blur",
    onLeave
  );

  window.addEventListener(
    "resize",
    readSize,
    { passive: true }
  );

  new MutationObserver(
    applyPalette
  ).observe(
    document.body,
    {
      attributes: true,
      attributeFilter: [
        "data-chapter"
      ]
    }
  );

  applyPalette();
  readSize();

  requestAnimationFrame(
    animate
  );
})();
