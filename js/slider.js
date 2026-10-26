document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('[data-slider]');

  sliders.forEach(slider => {
    const track = slider.querySelector('.slider__track');
    const prevBtn = slider.querySelector('.slider__btn--prev');
    const nextBtn = slider.querySelector('.slider__btn--next');
    const slides = Array.from(track.querySelectorAll('.slider__slide'));
    const isVenue = slider.classList.contains('slider--venue') || slider.dataset.slider === 'venue';

    if (!track || !prevBtn || !nextBtn || slides.length === 0) return;

    const getGap = () => {
      const style = getComputedStyle(track);
      return parseFloat(style.gap) || 20;
    };

    const getSlideWidth = () => slides[0].offsetWidth;

    const scrollByOne = (dir) => {
      const amount = getSlideWidth() + getGap();
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByOne(-1));
    nextBtn.addEventListener('click', () => scrollByOne(1));

    // Center-focus + opacity for venue slider
    const updateCenterMode = () => {
      if (!isVenue) return;

      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;

      let closest = null;
      let closestDist = Infinity;

      slides.forEach(slide => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const dist = Math.abs(slideCenter - trackCenter);

        slide.classList.remove('is-center', 'is-side');

        if (dist < closestDist) {
          closestDist = dist;
          closest = slide;
        }
      });

      slides.forEach(slide => {
        if (slide === closest) {
          slide.classList.add('is-center');
          slide.style.opacity = '1';
        } else {
          slide.classList.add('is-side');
          slide.style.opacity = '0.4';
        }
      });
    };

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 5;
      const atEnd = track.scrollLeft >= maxScroll - 5;
      prevBtn.style.opacity = atStart ? '0.35' : '1';
      nextBtn.style.opacity = atEnd ? '0.35' : '1';
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
    };

    const onScroll = () => {
      updateButtons();
      updateCenterMode();
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateButtons();
      updateCenterMode();
    });

    // Initial state
    updateButtons();
    requestAnimationFrame(() => {
      updateCenterMode();
      if (isVenue && slides.length > 2) {
        // Start with second slide roughly centered
        const amount = getSlideWidth() + getGap();
        track.scrollTo({ left: amount, behavior: 'instant' });
        setTimeout(updateCenterMode, 60);
      }
    });
  });
});

// ===== POPUP =====
(function () {
  const popup = document.getElementById('regPopup');
  if (!popup) return;

  const openBtns = document.querySelectorAll('.js-open-popup');
  const closeEls = popup.querySelectorAll('[data-close]');

  function openPopup() {
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });
  });

  closeEls.forEach(el => {
    el.addEventListener('click', closePopup);
  });

  // закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) {
      closePopup();
    }
  });
})();
