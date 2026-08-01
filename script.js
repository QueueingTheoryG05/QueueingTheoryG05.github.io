(() => {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  const currentLabel = document.getElementById('current-slide');
  const totalLabel = document.getElementById('total-slides');
  const chapterIndex = document.getElementById('chapter-index');
  const chapterTitle = document.getElementById('chapter-title');
  const overviewButton = document.getElementById('overview-button');
  const fullscreenButton = document.getElementById('fullscreen-button');
  const slideMap = document.getElementById('slide-map');
  const mapList = document.getElementById('map-list');
  const closeMapButton = document.getElementById('close-map');
  const progressBars = [
    document.getElementById('top-progress-bar'),
    document.getElementById('bottom-progress-bar')
  ].filter(Boolean);

  let imageLightbox = null;
  let lightboxImage = null;
  let lightboxCaption = null;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const pad = (value) => String(value).padStart(2, '0');
  const hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
  let current = hashMatch ? clamp(Number(hashMatch[1]) - 1, 0, slides.length - 1) : 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let wheelTotal = 0;
  let wheelTimer = null;

  function isMobileLayout() {
    return window.innerWidth <= 760 ||
      (window.innerWidth <= 900 && window.innerHeight <= 500 && window.matchMedia('(orientation: landscape)').matches);
  }

  function fitSlideContent(slide) {
    const content = slide?.querySelector('.slide-content');
    if (!content) return;
    /* Typography must remain identical between slides. The outer presentation
       stage already scales uniformly for the laptop screen, so per-slide
       transforms would make equivalent text categories appear at different
       sizes. */
    content.classList.remove('is-runtime-fitted');
    content.style.transform = '';
  }

  function updateInterface({ replaceHash = true } = {}) {
    const slide = slides[current];
    const chapter = slide.dataset.chapter || 'Presentation';
    const title = slide.dataset.title || `Slide ${current + 1}`;
    const progress = ((current + 1) / slides.length) * 100;

    if (currentLabel) currentLabel.textContent = pad(current + 1);
    if (totalLabel) totalLabel.textContent = pad(slides.length);
    if (chapterIndex) chapterIndex.textContent = chapter;
    if (chapterTitle) chapterTitle.textContent = title;
    progressBars.forEach((bar) => { bar.style.width = `${progress}%`; });

    document.body.dataset.chapter = chapter.toLowerCase().replace(/\s+/g, '-');
    document.title = `${pad(current + 1)} · ${title} | Queueing Theory`;

    mapList?.querySelectorAll('button[data-slide-index]').forEach((button, index) => {
      const active = index === current;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });

    const hash = `#slide-${current + 1}`;
    if (replaceHash) history.replaceState(null, '', hash);
    else if (window.location.hash !== hash) history.pushState(null, '', hash);

    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([slide])
        .then(() => fitSlideContent(slide))
        .catch(() => fitSlideContent(slide));
    } else {
      fitSlideContent(slide);
    }
  }

  function goTo(index, options = {}) {
    current = clamp(index, 0, slides.length - 1);
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) slide.scrollTop = 0;
    });
    updateInterface(options);
  }

  const next = () => goTo(current + 1, { replaceHash: false });
  const previous = () => goTo(current - 1, { replaceHash: false });

  function createOverview() {
    if (!mapList) return;
    mapList.innerHTML = slides.map((slide, index) => {
      const chapter = slide.dataset.chapter || 'Presentation';
      const title = slide.dataset.title || `Slide ${index + 1}`;
      return `<button type="button" data-slide-index="${index}"><b>${pad(index + 1)}</b><span><small>${chapter}</small><br>${title}</span></button>`;
    }).join('');

    mapList.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-slide-index]');
      if (!button) return;
      closeOverview();
      goTo(Number(button.dataset.slideIndex), { replaceHash: false });
    });
  }

  function openOverview() {
    if (!slideMap) return;
    slideMap.classList.add('is-open');
    slideMap.setAttribute('aria-hidden', 'false');
    mapList?.querySelector('button.is-current')?.scrollIntoView({ block: 'center' });
    closeMapButton?.focus();
  }

  function closeOverview() {
    if (!slideMap) return;
    slideMap.classList.remove('is-open');
    slideMap.setAttribute('aria-hidden', 'true');
    overviewButton?.focus();
  }

  const fullscreenHostDocument = (() => {
    try { return window.frameElement?.ownerDocument || document; }
    catch (_) { return document; }
  })();

  const fullscreenTarget = (() => {
    try { return window.frameElement || document.documentElement; }
    catch (_) { return document.documentElement; }
  })();

  async function toggleFullscreen() {
    const isFullscreen = Boolean(
      fullscreenHostDocument.fullscreenElement ||
      fullscreenHostDocument.webkitFullscreenElement ||
      document.fullscreenElement ||
      document.webkitFullscreenElement
    );

    if (isFullscreen) {
      const exit = fullscreenHostDocument.exitFullscreen ||
        fullscreenHostDocument.webkitExitFullscreen ||
        document.exitFullscreen ||
        document.webkitExitFullscreen;
      try { await exit?.call(fullscreenHostDocument); } catch (_) {}
      return;
    }

    const requestHost = fullscreenTarget.requestFullscreen ||
      fullscreenTarget.webkitRequestFullscreen;
    try {
      await requestHost?.call(fullscreenTarget, { navigationUI: 'hide' });
      return;
    } catch (_) {
      try {
        await requestHost?.call(fullscreenTarget);
        return;
      } catch (_) {}
    }

    const requestInner = document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen;
    try { await requestInner?.call(document.documentElement); } catch (_) {}
  }

  function createImageLightbox() {
    imageLightbox = document.createElement('div');
    imageLightbox.className = 'image-lightbox';
    imageLightbox.setAttribute('aria-hidden', 'true');
    imageLightbox.setAttribute('role', 'dialog');
    imageLightbox.setAttribute('aria-modal', 'true');
    imageLightbox.setAttribute('aria-label', 'Expanded figure');
    imageLightbox.innerHTML = `
      <button class="image-lightbox-close" type="button" aria-label="Close expanded figure">×</button>
      <figure><img alt="" /><figcaption></figcaption></figure>`;
    document.body.appendChild(imageLightbox);
    lightboxImage = imageLightbox.querySelector('img');
    lightboxCaption = imageLightbox.querySelector('figcaption');

    imageLightbox.querySelector('.image-lightbox-close')?.addEventListener('click', closeImageLightbox);
    imageLightbox.addEventListener('click', (event) => {
      if (event.target === imageLightbox || event.target === lightboxImage) closeImageLightbox();
    });

    document.querySelectorAll('.slide img:not(.logo-slot img)').forEach((image) => {
      image.dataset.lightboxImage = 'true';
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `${image.alt || 'Figure'} — open full image`);
      const open = () => openImageLightbox(image);
      image.addEventListener('click', open);
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
  }

  function openImageLightbox(sourceImage) {
    if (!imageLightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
    lightboxImage.alt = sourceImage.alt || 'Expanded figure';
    lightboxCaption.textContent = sourceImage.alt || '';
    imageLightbox.classList.add('is-open');
    imageLightbox.setAttribute('aria-hidden', 'false');
    imageLightbox.querySelector('.image-lightbox-close')?.focus();
  }

  function closeImageLightbox() {
    if (!imageLightbox?.classList.contains('is-open')) return;
    imageLightbox.classList.remove('is-open');
    imageLightbox.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-go]');
    if (!target) return;
    event.preventDefault();
    const destination = Number(target.dataset.go);
    if (Number.isFinite(destination)) goTo(destination, { replaceHash: false });
  });

  document.addEventListener('keydown', (event) => {
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    const overviewOpen = slideMap?.classList.contains('is-open');
    const lightboxOpen = imageLightbox?.classList.contains('is-open');
    if (event.key === 'Escape') {
      if (lightboxOpen) closeImageLightbox();
      else if (overviewOpen) closeOverview();
      else if (fullscreenHostDocument.fullscreenElement) fullscreenHostDocument.exitFullscreen().catch(() => {});
      return;
    }
    if (overviewOpen || lightboxOpen) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        event.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault(); previous(); break;
      case 'Home':
        event.preventDefault(); goTo(0, { replaceHash: false }); break;
      case 'End':
        event.preventDefault(); goTo(slides.length - 1, { replaceHash: false }); break;
      case 'o':
      case 'O':
        event.preventDefault(); openOverview(); break;
      case 'f':
      case 'F':
        event.preventDefault(); toggleFullscreen(); break;
      default:
        break;
    }
  });

  document.querySelectorAll('[role="button"][data-go]').forEach((item) => {
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goTo(Number(item.dataset.go), { replaceHash: false });
      }
    });
  });

  document.querySelector('.slide-stage')?.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) return;
    if (slideMap?.classList.contains('is-open') || imageLightbox?.classList.contains('is-open')) return;
    wheelTotal += event.deltaY || event.deltaX;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelTotal = 0; }, 170);
    if (Math.abs(wheelTotal) < 105) return;
    wheelTotal > 0 ? next() : previous();
    wheelTotal = 0;
  }, { passive: true });

  document.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (!event.changedTouches.length || slideMap?.classList.contains('is-open') || imageLightbox?.classList.contains('is-open')) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) >= 70 && Math.abs(dx) > Math.abs(dy) * 1.35) dx < 0 ? next() : previous();
  }, { passive: true });

  overviewButton?.addEventListener('click', openOverview);
  fullscreenButton?.addEventListener('click', toggleFullscreen);
  closeMapButton?.addEventListener('click', closeOverview);
  slideMap?.addEventListener('mousedown', (event) => {
    if (event.target === slideMap) closeOverview();
  });

  fullscreenHostDocument.addEventListener('fullscreenchange', () => {
    if (!fullscreenButton) return;
    fullscreenButton.innerHTML = fullscreenHostDocument.fullscreenElement
      ? '<span>F</span> Exit'
      : '<span>F</span> Fullscreen';
    fitSlideContent(slides[current]);
  });

  window.addEventListener('hashchange', () => {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (match) goTo(Number(match[1]) - 1);
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fitSlideContent(slides[current]), 120);
  }, { passive: true });

  document.querySelectorAll('.slide img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', () => fitSlideContent(slides[current]), { once: true });
  });

  createImageLightbox();
  createOverview();
  goTo(current);
})();
