
(() => {
  "use strict";

  const slides =
    Array.from(
      document.querySelectorAll(
        ".slide"
      )
    );

  const report = [];

  slides.forEach(
    slide => {
      const visual =
        slide.querySelector(
          ".morph-visual"
        );

      let removedNestedCards = 0;
      let removedDuplicates = 0;

      /*
        یک View Transition مستقل نباید داخل یک
        View Transition مستقل دیگر قرار گیرد.
      */

      if (visual) {
        visual
          .querySelectorAll(
            ".morph-card"
          )
          .forEach(
            card => {
              card.classList.remove(
                "morph-card"
              );

              card.style.removeProperty(
                "view-transition-name"
              );

              removedNestedCards += 1;
            }
          );
      }


      /*
        برای هر نام Morph فقط یک عنصر در هر اسلاید باقی می‌ماند.
      */

      [
        "morph-title",
        "morph-eyebrow",
        "morph-lead",
        "morph-visual",
        "morph-card"
      ].forEach(
        className => {
          const elements =
            Array.from(
              slide.querySelectorAll(
                `.${className}`
              )
            );

          elements
            .slice(1)
            .forEach(
              element => {
                element.classList.remove(
                  className
                );

                element.style
                  .removeProperty(
                    "view-transition-name"
                  );

                removedDuplicates += 1;
              }
            );
        }
      );


      /*
        چهار کارت Why RL نباید خودشان Morph مستقل داشته باشند.
        والد slide-content انتقال اصلی را انجام می‌دهد.
      */

      if (
        slide.id ===
        "slide-rl-bridge"
      ) {
        slide
          .querySelectorAll(
            ".rl-logic-chain > article"
          )
          .forEach(
            card => {
              card.classList.remove(
                "morph-card"
              );

              card.style.removeProperty(
                "view-transition-name"
              );
            }
          );
      }


      report.push({
        slide:
          slide.id || "(no id)",

        removedNestedCards,
        removedDuplicates,

        visual:
          Boolean(
            slide.querySelector(
              ".morph-visual"
            )
          ),

        card:
          Boolean(
            slide.querySelector(
              ".morph-card"
            )
          )
      });
    }
  );


  window
    .__PROJECT1_STABILITY_AUDIT__ =
    report;


  console.group(
    "[Project 1 Transition Stability]"
  );

  console.table(report);

  console.groupEnd();
})();
