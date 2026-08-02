
(() => {
  "use strict";

  /*
    اگر نسخه‌ای از این موتور از قبل فعال باشد،
    ابتدا Listenerهای آن پاک می‌شوند.
  */

  if (
    typeof window
      .__SMOOTH_GEOMETRIC_HOVER_CLEANUP__
    === "function"
  ) {
    window
      .__SMOOTH_GEOMETRIC_HOVER_CLEANUP__();
  }


  const finePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );


  const SELECTOR = [
    ".slide article",
    ".slide .formula-card",
    ".slide .figure-card",
    ".slide .map-item",
    ".slide .objective-box",
    ".slide .action-matrix-card",
    ".slide .observation-card",
    ".slide .result-table-wrap",
    ".slide .big-result-card",
    ".slide .matrix-card",
    ".slide .timeline-before",
    ".slide .timeline-after",
    ".slide .wins-column",
    ".slide .center-principle",
    ".slide .presenter-block",
    ".slide .title-meta-row > div",
    ".slide .doi-card",
    ".slide .state-update-card",
    ".slide .weight-card",
    ".slide .zoom-button",
    ".slide .paper-figure button",
    ".slide .table-figure button",
    ".slide .comparison-figures button",
    ".slide .figure-pair button",
    ".slide .map-list button",
    ".slide .morph-card",
    ".slide .u-morph-hover"
  ].join(",");


  const cleanupFunctions = [];
  const activeCards = new Set();

  let lastPointerX = -10000;
  let lastPointerY = -10000;
  let checkFrame = 0;


  function addListener(
    target,
    type,
    handler,
    options
  ) {
    target.addEventListener(
      type,
      handler,
      options
    );

    cleanupFunctions.push(
      () => {
        target.removeEventListener(
          type,
          handler,
          options
        );
      }
    );
  }


  function normalizedValue(
    value,
    fallback
  ) {
    const result =
      String(value || "").trim();

    if (
      !result
      ||
      result === "normal"
    ) {
      return fallback;
    }

    return result;
  }


  function isRenderable(
    element
  ) {
    const style =
      getComputedStyle(element);

    const rect =
      element.getBoundingClientRect();

    return (
      style.display !== "none"
      &&
      style.visibility !== "hidden"
      &&
      rect.width >= 38
      &&
      rect.height >= 24
    );
  }


  function clearOldClasses(
    element
  ) {
    element.classList.remove(
      "stable-hover-card",
      "smooth-hover-card",
      "smooth-hover-passive",
      "is-smooth-hover"
    );

    [
      "--stable-hover-base-transform",
      "--stable-hover-base-translate",
      "--stable-hover-base-scale",
      "--stable-hover-base-rotate",
      "--stable-hover-base-filter",

      "--smooth-hover-base-transform",
      "--smooth-hover-base-filter",
      "--smooth-hover-base-shadow",
      "--smooth-hover-base-border-color",

      "--smooth-hover-border-top-width",
      "--smooth-hover-border-right-width",
      "--smooth-hover-border-bottom-width",
      "--smooth-hover-border-left-width"
    ].forEach(
      property => {
        element.style.removeProperty(
          property
        );
      }
    );
  }


  function captureBaseStyle(
    element
  ) {
    clearOldClasses(element);

    const style =
      getComputedStyle(element);

    const rect =
      element.getBoundingClientRect();


    element.style.setProperty(
      "--smooth-hover-base-transform",
      normalizedValue(
        style.transform,
        "none"
      )
    );


    element.style.setProperty(
      "--smooth-hover-base-filter",
      normalizedValue(
        style.filter,
        "none"
      )
    );


    element.style.setProperty(
      "--smooth-hover-base-shadow",
      normalizedValue(
        style.boxShadow,
        "none"
      )
    );


    element.style.setProperty(
      "--smooth-hover-base-border-color",
      normalizedValue(
        style.borderColor,
        "transparent"
      )
    );


    element.style.setProperty(
      "--smooth-hover-border-top-width",
      normalizedValue(
        style.borderTopWidth,
        "0px"
      )
    );


    element.style.setProperty(
      "--smooth-hover-border-right-width",
      normalizedValue(
        style.borderRightWidth,
        "0px"
      )
    );


    element.style.setProperty(
      "--smooth-hover-border-bottom-width",
      normalizedValue(
        style.borderBottomWidth,
        "0px"
      )
    );


    element.style.setProperty(
      "--smooth-hover-border-left-width",
      normalizedValue(
        style.borderLeftWidth,
        "0px"
      )
    );


    if (
      rect.width >= 720
      ||
      rect.height >= 390
    ) {
      element.dataset
        .smoothHoverSize =
        "large";
    } else if (
      rect.width <= 170
      ||
      rect.height <= 72
    ) {
      element.dataset
        .smoothHoverSize =
        "small";
    } else {
      element.dataset
        .smoothHoverSize =
        "normal";
    }
  }


  /*
    اگر یک کارت داخل کارت دیگری باشد،
    فقط داخلی‌ترین کارت حرکت می‌کند.

    این بخش مانع حرکت هم‌زمان Parent و Child می‌شود.
  */

  const rawCandidates =
    Array.from(
      new Set(
        document.querySelectorAll(
          SELECTOR
        )
      )
    ).filter(
      isRenderable
    );


  rawCandidates.forEach(
    captureBaseStyle
  );


  const leafCards =
    rawCandidates.filter(
      candidate => {
        return !rawCandidates.some(
          other => {
            return (
              other !== candidate
              &&
              candidate.contains(other)
            );
          }
        );
      }
    );


  const leafSet =
    new Set(leafCards);


  rawCandidates.forEach(
    element => {
      if (leafSet.has(element)) {
        element.classList.add(
          "smooth-hover-card"
        );
      } else {
        element.classList.add(
          "smooth-hover-passive"
        );
      }
    }
  );


  function expandedRect(
    rect,
    padding = 13
  ) {
    return {
      left:
        rect.left - padding,

      right:
        rect.right + padding,

      top:
        rect.top - padding,

      bottom:
        rect.bottom + padding
    };
  }


  function pointInside(
    rect,
    x,
    y
  ) {
    return (
      x >= rect.left
      &&
      x <= rect.right
      &&
      y >= rect.top
      &&
      y <= rect.bottom
    );
  }


  function deactivate(
    element
  ) {
    element.classList.remove(
      "is-smooth-hover"
    );

    element.removeAttribute(
      "data-smooth-hover-active"
    );

    activeCards.delete(element);
  }


  function deactivateAll(
    except = null
  ) {
    Array.from(
      activeCards
    ).forEach(
      element => {
        if (element !== except) {
          deactivate(element);
        }
      }
    );
  }


  function activate(
    element,
    event
  ) {
    if (
      !finePointer.matches
      ||
      (
        event.pointerType
        &&
        event.pointerType !== "mouse"
      )
    ) {
      return;
    }


    deactivateAll(element);


    /*
      Rect قبل از حرکت ذخیره می‌شود.
      با حرکت خود کارت، این Hit Area جابه‌جا نمی‌شود.
    */

    const baseRect =
      element.getBoundingClientRect();


    element
      .__smoothHoverHitRect =
      expandedRect(
        baseRect,
        13
      );


    element.classList.add(
      "is-smooth-hover"
    );


    element.setAttribute(
      "data-smooth-hover-active",
      "true"
    );


    activeCards.add(element);
  }


  function checkActiveCards() {
    checkFrame = 0;

    Array.from(
      activeCards
    ).forEach(
      element => {
        const rect =
          element
            .__smoothHoverHitRect;

        if (
          !rect
          ||
          !pointInside(
            rect,
            lastPointerX,
            lastPointerY
          )
        ) {
          deactivate(element);
        }
      }
    );
  }


  function scheduleCheck() {
    if (checkFrame) {
      return;
    }

    checkFrame =
      requestAnimationFrame(
        checkActiveCards
      );
  }


  leafCards.forEach(
    element => {
      const onEnter = event => {
        lastPointerX =
          event.clientX;

        lastPointerY =
          event.clientY;

        activate(
          element,
          event
        );
      };


      const onLeave = event => {
        lastPointerX =
          event.clientX;

        lastPointerY =
          event.clientY;

        /*
          خروج لحظه‌ای ناشی از حرکت خود کارت
          فوراً Hover را خاموش نمی‌کند.
        */

        window.setTimeout(
          scheduleCheck,
          65
        );
      };


      addListener(
        element,
        "pointerenter",
        onEnter,
        {
          passive: true
        }
      );


      addListener(
        element,
        "pointerleave",
        onLeave,
        {
          passive: true
        }
      );
    }
  );


  const onDocumentPointerMove = event => {
    if (
      event.pointerType
      &&
      event.pointerType !== "mouse"
    ) {
      return;
    }

    lastPointerX =
      event.clientX;

    lastPointerY =
      event.clientY;

    scheduleCheck();
  };


  addListener(
    document,
    "pointermove",
    onDocumentPointerMove,
    {
      passive: true,
      capture: true
    }
  );


  /*
    هنگام جابه‌جایی اسلاید، هیچ کارت Hoverشده‌ای
    وارد Snapshot انتقال نمی‌شود.
  */

  const clearForNavigation = () => {
    deactivateAll();
  };


  addListener(
    document,
    "keydown",
    clearForNavigation,
    {
      capture: true
    }
  );


  addListener(
    document,
    "wheel",
    clearForNavigation,
    {
      passive: true,
      capture: true
    }
  );


  addListener(
    window,
    "hashchange",
    clearForNavigation
  );


  addListener(
    window,
    "blur",
    clearForNavigation
  );


  const slideObserver =
    new MutationObserver(
      mutations => {
        const slideChanged =
          mutations.some(
            mutation => {
              return (
                mutation.type
                === "attributes"
                &&
                mutation.attributeName
                === "class"
              );
            }
          );

        if (slideChanged) {
          deactivateAll();
        }
      }
    );


  document
    .querySelectorAll(
      ".slide"
    )
    .forEach(
      slide => {
        slideObserver.observe(
          slide,
          {
            attributes: true,
            attributeFilter: [
              "class"
            ]
          }
        );
      }
    );


  cleanupFunctions.push(
    () => {
      slideObserver.disconnect();
    }
  );


  window
    .__SMOOTH_GEOMETRIC_HOVER_AUDIT__ =
    rawCandidates.map(
      (
        element,
        index
      ) => {
        return {
          index:
            index + 1,

          slide:
            element.closest(
              ".slide"
            )?.id
            ||
            "(unknown)",

          element:
            element.tagName
              .toLowerCase(),

          mode:
            leafSet.has(element)
              ? "moving leaf"
              : "passive parent",

          size:
            element.dataset
              .smoothHoverSize
            ||
            "normal",

          classes:
            String(
              element.className
              ||
              ""
            )
        };
      }
    );


  window
    .__SMOOTH_GEOMETRIC_HOVER_CLEANUP__ =
    () => {
      deactivateAll();

      cleanupFunctions.forEach(
        cleanup => {
          try {
            cleanup();
          } catch (_) {}
        }
      );

      rawCandidates.forEach(
        element => {
          clearOldClasses(element);

          delete element
            .__smoothHoverHitRect;

          delete element.dataset
            .smoothHoverSize;
        }
      );

      if (checkFrame) {
        cancelAnimationFrame(
          checkFrame
        );

        checkFrame = 0;
      }
    };


  console.group(
    "[Smooth Geometric Hover]"
  );

  console.log(
    `Moving cards: ${leafCards.length}`
  );

  console.log(
    `Passive nested parents: ${
      rawCandidates.length
      -
      leafCards.length
    }`
  );

  console.table(
    window
      .__SMOOTH_GEOMETRIC_HOVER_AUDIT__
  );

  console.groupEnd();
})();
