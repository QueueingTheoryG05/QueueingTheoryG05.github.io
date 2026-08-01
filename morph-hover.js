(() => {
  "use strict";
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches) return;

  const selector = [
    ".slide-content article",
    ".slide-content .figure-card",
    ".slide-content .objective-box",
    ".slide-content .decision-banner",
    ".slide-content .one-line-claim",
    ".slide-content .partial-observation-banner",
    ".slide-content .policy-lookup",
    ".slide-content .observation-card",
    ".slide-content .formula-card",
    ".slide-content .weight-card",
    ".slide-content .architecture-warning",
    ".slide-content .final-equation",
    ".slide-content .closing-policy-rule",
    ".slide-content .result-table-wrap",
    ".slide-content .big-result-card",
    ".presenter-block",
    ".title-meta-row > div"
  ].join(",");

  const cards = [...document.querySelectorAll(selector)];
  cards.forEach((card) => {
    card.classList.add("morph-card");
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--morph-x", `${Math.max(0, Math.min(100, x))}%`);
      card.style.setProperty("--morph-y", `${Math.max(0, Math.min(100, y))}%`);
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--morph-x");
      card.style.removeProperty("--morph-y");
    }, { passive: true });
  });
})();
