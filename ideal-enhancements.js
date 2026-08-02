
(() => {
  "use strict";

  const slides = [
    ...document.querySelectorAll(
      ".slide"
    )
  ];

  const stage =
    document.querySelector(
      ".slide-stage"
    );

  if (
    !slides.length ||
    !stage
  ) {
    return;
  }

  const MOBILE_QUERY =
    matchMedia(
      "(max-width: 760px), "
      +
      "(max-width: 900px) "
      +
      "and (max-height: 500px) "
      +
      "and (orientation: landscape)"
    );

  const TITLE_SELECTOR = [
    ".type-slide-title",
    ".display-title",
    ".type-card-title",
    ".mm-flow-title",
    ".type-banner",
    ".type-body-copy"
  ].join(",");

  const CARD_SELECTOR = [
    ":scope > article",
    ":scope > .card",
    ":scope > .metric-card",
    ":scope > .formula-card",
    ":scope > .weight-card",
    ":scope > .observation-card"
  ].join(",");

  let scheduled = 0;

  const activeSlide = () => {
    return (
      document.querySelector(
        ".slide.is-active"
      )
      ||
      slides[0]
    );
  };

  const clearRuntimeStyles = (
    slide
  ) => {
    slide.classList.remove(
      "has-runtime-overflow"
    );

    slide
      .querySelectorAll(
        "[data-ideal-autofit='true']"
      )
      .forEach(
        element => {
          element.style.removeProperty(
            "font-size"
          );
        }
      );

    slide
      .querySelectorAll(
        "[data-ideal-equalized='true']"
      )
      .forEach(
        card => {
          card.style.removeProperty(
            "min-height"
          );

          delete card.dataset
            .idealEqualized;
        }
      );
  };

  const candidateContainers = (
    slide
  ) => {
    const parents =
      new Set();

    slide
      .querySelectorAll(
        ".slide-content article"
      )
      .forEach(
        card => {
          if (card.parentElement) {
            parents.add(
              card.parentElement
            );
          }
        }
      );

    return [
      ...parents
    ];
  };

  const equalizeCardRows = (
    slide
  ) => {
    if (MOBILE_QUERY.matches) {
      return;
    }

    candidateContainers(
      slide
    ).forEach(
      container => {
        let cards;

        try {
          cards = [
            ...container
              .querySelectorAll(
                CARD_SELECTOR
              )
          ];
        } catch (_) {
          cards = [
            ...container.children
          ].filter(
            child => {
              return child.matches(
                "article,"
                +
                ".card,"
                +
                ".metric-card,"
                +
                ".formula-card,"
                +
                ".weight-card,"
                +
                ".observation-card"
              );
            }
          );
        }

        if (
          cards.length < 2 ||
          cards.length > 12
        ) {
          return;
        }

        cards.forEach(
          card => {
            card.style.removeProperty(
              "min-height"
            );
          }
        );

        const rows = [];

        cards.forEach(
          card => {
            const top =
              Math.round(
                card
                  .getBoundingClientRect()
                  .top
              );

            let row =
              rows.find(
                group =>
                  Math.abs(
                    group.top - top
                  ) <= 4
              );

            if (!row) {
              row = {
                top,
                cards: []
              };

              rows.push(row);
            }

            row.cards.push(card);
          }
        );

        rows.forEach(
          row => {
            if (
              row.cards.length < 2
            ) {
              return;
            }

            const maxHeight =
              Math.ceil(
                Math.max(
                  ...row.cards.map(
                    card =>
                      card
                        .getBoundingClientRect()
                        .height
                  )
                )
              );

            row.cards.forEach(
              card => {
                card.style.minHeight =
                  `${maxHeight}px`;

                card.dataset
                  .idealEqualized =
                  "true";
              }
            );
          }
        );
      }
    );
  };

  const overflowsStage = (
    slide
  ) => {
    const stageRect =
      stage.getBoundingClientRect();

    const visibleNodes = [
      ...slide.children
    ].filter(
      node => {
        const style =
          getComputedStyle(node);

        return (
          style.display !== "none"
          &&
          style.visibility !==
            "hidden"
        );
      }
    );

    if (!visibleNodes.length) {
      return false;
    }

    const bottom =
      Math.max(
        ...visibleNodes.map(
          node =>
            node
              .getBoundingClientRect()
              .bottom
        )
      );

    const right =
      Math.max(
        ...visibleNodes.map(
          node =>
            node
              .getBoundingClientRect()
              .right
        )
      );

    return (
      bottom >
        stageRect.bottom - 4
      ||
      right >
        stageRect.right + 4
    );
  };

  const fitOverflowingText = (
    slide
  ) => {
    if (MOBILE_QUERY.matches) {
      return;
    }

    const candidates = [
      ...slide.querySelectorAll(
        TITLE_SELECTOR
      )
    ].filter(
      element => {
        const style =
          getComputedStyle(
            element
          );

        return (
          style.display !== "none"
          &&
          Number.parseFloat(
            style.fontSize
          ) >= 12
        );
      }
    );

    candidates.forEach(
      element => {
        if (
          !element.dataset
            .idealBaseFontSize
        ) {
          element.dataset
            .idealBaseFontSize =
            String(
              Number.parseFloat(
                getComputedStyle(
                  element
                ).fontSize
              )
            );
        }

        element.dataset
          .idealAutofit =
          "true";
      }
    );

    if (
      !overflowsStage(slide)
    ) {
      return;
    }

    const groups = [
      candidates.filter(
        element =>
          element.matches(
            ".type-slide-title,"
            +
            ".display-title"
          )
      ),

      candidates.filter(
        element =>
          element.matches(
            ".type-card-title,"
            +
            ".mm-flow-title,"
            +
            ".type-banner"
          )
      ),

      candidates.filter(
        element =>
          element.matches(
            ".type-body-copy"
          )
      )
    ];

    const minimumRatios = [
      0.78,
      0.82,
      0.90
    ];

    for (
      let groupIndex = 0;
      groupIndex < groups.length
      &&
      overflowsStage(slide);
      groupIndex += 1
    ) {
      const group =
        groups[groupIndex];

      for (
        let step = 1;
        step <= 10
        &&
        overflowsStage(slide);
        step += 1
      ) {
        const ratio =
          Math.max(
            minimumRatios[
              groupIndex
            ],
            1 - step * 0.025
          );

        group.forEach(
          element => {
            const base =
              Number.parseFloat(
                element.dataset
                  .idealBaseFontSize
                ||
                "0"
              );

            if (base > 0) {
              element.style.fontSize =
                `${
                  (
                    base * ratio
                  ).toFixed(2)
                }px`;
            }
          }
        );

        equalizeCardRows(
          slide
        );
      }
    }

    slide.classList.toggle(
      "has-runtime-overflow",
      overflowsStage(slide)
    );
  };

  const enhanceActiveSlide = () => {
    const slide =
      activeSlide();

    clearRuntimeStyles(
      slide
    );

    equalizeCardRows(
      slide
    );

    fitOverflowingText(
      slide
    );
  };

  const schedule = () => {
    cancelAnimationFrame(
      scheduled
    );

    scheduled =
      requestAnimationFrame(
        () => {
          requestAnimationFrame(
            enhanceActiveSlide
          );
        }
      );
  };

  /*
    Preload همه تصاویر پس از رندر اولیه
  */
  const preloadImages = () => {
    const run = () => {
      document
        .querySelectorAll(
          ".slide img[src]"
        )
        .forEach(
          image => {
            const source =
              image.currentSrc
              ||
              image.getAttribute(
                "src"
              );

            if (
              !source
              ||
              image.dataset
                .idealPreloaded
                === "true"
            ) {
              return;
            }

            image.dataset
              .idealPreloaded =
              "true";

            const preload =
              new Image();

            preload.decoding =
              "async";

            preload.src =
              source;
          }
        );
    };

    if (
      "requestIdleCallback"
      in window
    ) {
      requestIdleCallback(
        run,
        {
          timeout: 1800
        }
      );
    } else {
      setTimeout(
        run,
        300
      );
    }
  };

  const mutationObserver =
    new MutationObserver(
      mutations => {
        const relevant =
          mutations.some(
            mutation => {
              return (
                mutation.type
                  === "attributes"
                ||
                mutation.type
                  === "childList"
              );
            }
          );

        if (relevant) {
          schedule();
        }
      }
    );

  slides.forEach(
    slide => {
      mutationObserver.observe(
        slide,
        {
          attributes: true,

          attributeFilter: [
            "class",
            "aria-hidden"
          ],

          childList: true,
          subtree: true
        }
      );
    }
  );

  if (
    "ResizeObserver"
    in window
  ) {
    const resizeObserver =
      new ResizeObserver(
        schedule
      );

    resizeObserver.observe(
      stage
    );

    slides.forEach(
      slide => {
        resizeObserver.observe(
          slide
        );
      }
    );
  } else {
    window.addEventListener(
      "resize",
      schedule,
      {
        passive: true
      }
    );
  }

  MOBILE_QUERY
    .addEventListener?.(
      "change",
      schedule
    );

  window.visualViewport
    ?.addEventListener(
      "resize",
      schedule,
      {
        passive: true
      }
    );

  document.fonts
    ?.ready
    ?.then(schedule)
    .catch(
      () => {}
    );

  window.MathJax
    ?.startup
    ?.promise
    ?.then(schedule)
    .catch(
      () => {}
    );

  document
    .querySelectorAll(
      ".slide img"
    )
    .forEach(
      image => {
        image.addEventListener(
          "load",
          schedule,
          {
            passive: true
          }
        );
      }
    );

  window.addEventListener(
    "load",
    () => {
      preloadImages();
      schedule();
    },
    {
      once: true
    }
  );

  schedule();
})();
