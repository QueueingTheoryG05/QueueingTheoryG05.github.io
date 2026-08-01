(() => {
  "use strict";

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches || document.querySelector(".presentation-pointer")) return;

  const root = document.documentElement;
  const pointer = document.createElement("div");
  const glow = document.createElement("div");
  pointer.className = "presentation-pointer";
  glow.className = "presentation-pointer-glow";
  pointer.setAttribute("aria-hidden", "true");
  glow.setAttribute("aria-hidden", "true");
  document.body.append(glow, pointer);
  root.classList.add("presentation-pointer-ready");

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

  let targetX = innerWidth / 2;
  let targetY = innerHeight / 2;
  let pointerX = targetX;
  let pointerY = targetY;
  let glowX = targetX;
  let glowY = targetY;
  let pointerSize = 10;
  let glowSize = 68;
  let visible = false;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const normalizeChapter = (value) => String(value || "")
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function applyPalette() {
    const slideChapter = document.querySelector(".slide.is-active")?.dataset.chapter;
    const chapter = normalizeChapter(document.body.dataset.chapter || slideChapter);
    root.style.setProperty("--pointer-rgb", palettes[chapter] || palettes.default);
  }

  function setVisible(state) {
    visible = state;
    pointer.classList.toggle("is-visible", state);
    glow.classList.toggle("is-visible", state);
  }

  function isInteractive(target) {
    return target instanceof Element && Boolean(target.closest(
      "a, button, input, select, textarea, summary, label, [role='button'], [role='link'], [tabindex]:not([tabindex='-1']), .zoomable-image, .morph-card"
    ));
  }

  function isTextual(target) {
    if (!(target instanceof Element) || isInteractive(target)) return false;
    return Boolean(target.closest(
      "p, span, li, small, strong, em, code, figcaption, h1, h2, h3, h4, td, th"
    ));
  }

  function onMove(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      pointerX = glowX = targetX;
      pointerY = glowY = targetY;
      setVisible(true);
    }
    const interactive = isInteractive(event.target);
    const overText = isTextual(event.target);
    pointer.classList.toggle("is-interactive", interactive);
    pointer.classList.toggle("is-over-text", overText);
    glow.classList.toggle("is-over-text", overText);
  }

  function onDown(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    pointer.classList.add("is-pressed");
    glow.classList.add("is-pressed");
  }
  function onUp() {
    pointer.classList.remove("is-pressed");
    glow.classList.remove("is-pressed");
  }
  function onLeave() {
    setVisible(false);
    onUp();
    pointer.classList.remove("is-interactive", "is-over-text");
    glow.classList.remove("is-over-text");
  }
  function readSizes() {
    pointerSize = pointer.getBoundingClientRect().width || 10;
    glowSize = glow.getBoundingClientRect().width || 68;
  }
  function animate() {
    const pointerEase = reducedMotion ? 1 : .54;
    const glowEase = reducedMotion ? 1 : .15;
    pointerX += (targetX - pointerX) * pointerEase;
    pointerY += (targetY - pointerY) * pointerEase;
    glowX += (targetX - glowX) * glowEase;
    glowY += (targetY - glowY) * glowEase;
    readSizes();
    pointer.style.transform = `translate3d(${pointerX - pointerSize / 2}px, ${pointerY - pointerSize / 2}px, 0)`;
    glow.style.transform = `translate3d(${glowX - glowSize / 2}px, ${glowY - glowSize / 2}px, 0)`;
    requestAnimationFrame(animate);
  }

  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("pointerdown", onDown, { passive: true });
  addEventListener("pointerup", onUp, { passive: true });
  addEventListener("pointercancel", onUp, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave, { passive: true });
  addEventListener("blur", onLeave);
  addEventListener("resize", readSizes, { passive: true });
  new MutationObserver(applyPalette).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-chapter"],
    childList: true,
    subtree: true
  });

  applyPalette();
  readSizes();
  requestAnimationFrame(animate);
})();
