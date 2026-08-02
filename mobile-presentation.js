
(() => {
  "use strict";

  const footer =
    document.querySelector(".bottom-frame");

  const slides = [
    ...document.querySelectorAll(".slide")
  ];

  const overviewButton =
    document.getElementById("overview-button");

  const currentLabel =
    document.getElementById("current-slide");

  const totalLabel =
    document.getElementById("total-slides");

  if (
    !footer ||
    !slides.length ||
    footer.querySelector(".mobile-navigation")
  ) {
    return;
  }

  const nav =
    document.createElement("nav");

  nav.className =
    "mobile-navigation";

  nav.setAttribute(
    "aria-label",
    "Mobile slide controls"
  );

  nav.innerHTML = `
    <button
      class="mobile-nav-button"
      id="mobile-previous"
      type="button"
      aria-label="Previous slide"
    >
      <span
        class="mobile-nav-icon"
        aria-hidden="true"
      >‹</span>

      <span>Previous</span>
    </button>

    <button
      class="mobile-nav-button mobile-overview-button"
      id="mobile-overview"
      type="button"
      aria-label="Open slide overview"
    >
      <strong>
        <span id="mobile-current">01</span>
        /
        <span id="mobile-total">
          ${String(slides.length).padStart(2, "0")}
        </span>
      </strong>

      <small>Overview</small>
    </button>

    <button
      class="mobile-nav-button"
      id="mobile-next"
      type="button"
      aria-label="Next slide"
    >
      <span>Next</span>

      <span
        class="mobile-nav-icon"
        aria-hidden="true"
      >›</span>
    </button>
  `;

  const progress =
    footer.querySelector(".bottom-progress");

  if (progress) {
    footer.insertBefore(
      nav,
      progress
    );
  } else {
    footer.appendChild(nav);
  }

  const previous =
    nav.querySelector("#mobile-previous");

  const next =
    nav.querySelector("#mobile-next");

  const overview =
    nav.querySelector("#mobile-overview");

  const mobileCurrent =
    nav.querySelector("#mobile-current");

  const mobileTotal =
    nav.querySelector("#mobile-total");

  const dispatchNavigationKey = (key) => {
    document.dispatchEvent(
      new KeyboardEvent(
        "keydown",
        {
          key,
          bubbles: true,
          cancelable: true
        }
      )
    );
  };

  previous.addEventListener(
    "click",
    () => {
      dispatchNavigationKey(
        "ArrowLeft"
      );
    }
  );

  next.addEventListener(
    "click",
    () => {
      dispatchNavigationKey(
        "ArrowRight"
      );
    }
  );

  overview.addEventListener(
    "click",
    () => {
      overviewButton?.click();
    }
  );

  const update = () => {
    const activeIndex = Math.max(
      0,
      slides.findIndex(
        slide =>
          slide.classList.contains(
            "is-active"
          )
      )
    );

    const currentText =
      currentLabel
        ?.textContent
        ?.trim()
      ||
      String(
        activeIndex + 1
      ).padStart(
        2,
        "0"
      );

    const totalText =
      totalLabel
        ?.textContent
        ?.trim()
      ||
      String(
        slides.length
      ).padStart(
        2,
        "0"
      );

    mobileCurrent.textContent =
      currentText;

    mobileTotal.textContent =
      totalText;

    previous.disabled =
      activeIndex <= 0;

    next.disabled =
      activeIndex >=
      slides.length - 1;

    const activeSlide =
      slides[activeIndex];

    if (activeSlide) {
      requestAnimationFrame(
        () => {
          activeSlide.scrollTo({
            top: 0,
            behavior: "auto"
          });
        }
      );
    }
  };

  const observer =
    new MutationObserver(update);

  slides.forEach(
    slide => {
      observer.observe(
        slide,
        {
          attributes: true,
          attributeFilter: [
            "class",
            "aria-hidden"
          ]
        }
      );
    }
  );

  if (currentLabel) {
    observer.observe(
      currentLabel,
      {
        childList: true,
        characterData: true,
        subtree: true
      }
    );
  }

  window.addEventListener(
    "hashchange",
    update,
    {
      passive: true
    }
  );

  window.addEventListener(
    "resize",
    update,
    {
      passive: true
    }
  );

  update();
})();
