
(() => {
  "use strict";

  const slides = Array.from(
    document.querySelectorAll(
      ".slide"
    )
  );

  if (!slides.length) {
    return;
  }


  const BASE_MORPH_CLASSES = [
    "morph-title",
    "morph-eyebrow",
    "morph-lead",
    "morph-visual",
    "morph-card"
  ];


  const TITLE_SELECTORS = [
    ".display-title",
    ".type-slide-title",
    ".slide-heading h2",
    ".hero-copy h1",
    ".closing-layout h2",
    ".closing-slide h2",
    "h1",
    "h2"
  ];


  const EYEBROW_SELECTORS = [
    ".type-eyebrow",
    ".eyebrow",
    ".slide-heading > p:first-child"
  ];


  const LEAD_SELECTORS = [
    ".hero-subtitle",
    ".slide-heading .lead",
    ".comparison-intro",
    ".transition-claim",
    ".delayed-question",
    ".decision-banner",
    ".nonstationary-message",
    ".rl-conclusion",
    ".partial-observation-banner",
    ".policy-lookup",
    ".closing-policy-rule",
    ".type-banner"
  ];


  const CARD_SELECTORS = [
    ".presenter-block",

    ".state-update-card",
    ".comparison-footnote-card",
    ".big-result-card",
    ".policy-lookup",
    ".decision-banner",
    ".closing-names",
    ".doi-card",

    "article.accent-card",
    "article.accent-card-lite",

    ".slide-content article"
  ];


  function firstMatch(
    root,
    selectors
  ) {
    for (
      const selector
      of selectors
    ) {
      const element =
        root.querySelector(
          selector
        );

      if (element) {
        return element;
      }
    }

    return null;
  }


  function clearPreviousSystems(
    slide
  ) {
    slide
      .querySelectorAll("*")
      .forEach(
        element => {
          BASE_MORPH_CLASSES
            .forEach(
              className => {
                element.classList.remove(
                  className
                );
              }
            );


          Array.from(
            element.classList
          ).forEach(
            className => {
              if (
                className.startsWith(
                  "u-morph-"
                )
              ) {
                element.classList.remove(
                  className
                );
              }
            }
          );


          element.style.removeProperty(
            "view-transition-name"
          );


          element.removeAttribute(
            "data-ppt-morph-name"
          );

          element.removeAttribute(
            "data-morph-coverage"
          );

          element.removeAttribute(
            "data-ideal-autofit"
          );

          element.removeAttribute(
            "data-ideal-equalized"
          );
        }
      );
  }


  function chooseVisual(
    slide
  ) {
    const content =
      slide.querySelector(
        ".slide-content"
      );

    if (content) {
      const children =
        Array.from(
          content.children
        ).filter(
          child => {
            return (
              !child.matches(
                ".source-note, .type-caption"
              )
            );
          }
        );


      /*
        پروژهٔ اول معمولاً یک Wrapper کلی را به‌عنوان
        morph-visual انتخاب می‌کرد.

        اگر یک فرزند اصلی وجود داشته باشد، همان انتخاب می‌شود.
        اگر چند بخش هم‌سطح وجود داشته باشند، خود slide-content
        به‌عنوان ظرف اصلی انتخاب می‌شود.
      */

      if (children.length === 1) {
        return children[0];
      }

      return content;
    }


    return (
      slide.querySelector(
        ".closing-mark"
      )
      ||
      null
    );
  }


  function chooseCard(
    slide,
    excludedElements
  ) {
    for (
      const selector
      of CARD_SELECTORS
    ) {
      const candidates =
        Array.from(
          slide.querySelectorAll(
            selector
          )
        );


      const candidate =
        candidates.find(
          element => {
            return (
              !excludedElements.has(
                element
              )
              &&
              element
                .getBoundingClientRect()
                .width > 40
              &&
              element
                .getBoundingClientRect()
                .height > 24
            );
          }
        );


      if (candidate) {
        return candidate;
      }
    }

    return null;
  }


  const report =
    slides.map(
      (
        slide,
        index
      ) => {
        clearPreviousSystems(
          slide
        );


        const title =
          firstMatch(
            slide,
            TITLE_SELECTORS
          );


        const eyebrow =
          firstMatch(
            slide,
            EYEBROW_SELECTORS
          );


        const lead =
          firstMatch(
            slide,
            LEAD_SELECTORS
          );


        const visual =
          chooseVisual(
            slide
          );


        const excluded =
          new Set(
            [
              title,
              eyebrow,
              lead,
              visual
            ].filter(Boolean)
          );


        const card =
          chooseCard(
            slide,
            excluded
          );


        title?.classList.add(
          "morph-title"
        );


        eyebrow?.classList.add(
          "morph-eyebrow"
        );


        lead?.classList.add(
          "morph-lead"
        );


        visual?.classList.add(
          "morph-visual"
        );


        card?.classList.add(
          "morph-card"
        );


        return {
          slide:
            slide.id
            ||
            `slide-${index + 1}`,

          title:
            Boolean(title),

          eyebrow:
            Boolean(eyebrow),

          lead:
            Boolean(lead),

          visual:
            Boolean(visual),

          card:
            Boolean(card),

          /*
            اسلاید اول پروژهٔ مرجع نیز morph-visual نداشت؛
            بنابراین عنوان همراه با lead/card پوشش معتبر است.
          */

          valid:
            Boolean(title)
            &&
            Boolean(
              visual
              ||
              card
              ||
              lead
            )
        };
      }
    );


  window.__PROJECT1_TRANSITION_AUDIT__ =
    report;


  document.body.dataset
    .project1TransitionReady =
    "true";


  console.group(
    "[Project 1 Transition Audit]"
  );

  console.table(
    report
  );


  const failed =
    report.filter(
      item => !item.valid
    );


  if (failed.length) {
    console.error(
      "Slides without sufficient transition anchors:",
      failed
    );
  } else {
    console.info(
      `All ${report.length} slides use the Project 1 transition pattern.`
    );
  }


  console.groupEnd();
})();
