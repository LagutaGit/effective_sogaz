document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-slider]').forEach(initSlider);
});

function initSlider(slider) {
  const track = slider.querySelector('.slider__track');
  const prevBtn = slider.querySelector('.slider__btn--prev');
  const nextBtn = slider.querySelector('.slider__btn--next');
  const slides = Array.from(track?.querySelectorAll('.slider__slide') || []);

  if (!track || !prevBtn || !nextBtn || slides.length === 0) return;

  const isVenue = slider.classList.contains('slider--venue');
  let index = 0;

  const getGap = () => parseFloat(getComputedStyle(track).gap) || 16;

  const goTo = (i) => {
    index = Math.max(0, Math.min(i, slides.length - 1));
    const gap = getGap();
    const slideW = slides[0].offsetWidth;
    const left = index * (slideW + gap);
    track.scrollTo({ left, behavior: 'smooth' });
    updateUI();
  };

  const updateUI = () => {
    prevBtn.style.opacity = index <= 0 ? '0.35' : '1';
    nextBtn.style.opacity = index >= slides.length - 1 ? '0.35' : '1';

    if (isVenue) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('is-center');
          slide.classList.remove('is-side');
          slide.style.opacity = '1';
        } else {
          slide.classList.add('is-side');
          slide.classList.remove('is-center');
          slide.style.opacity = '0.4';
        }
      });
    }
  };

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(index - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(index + 1);
  });

  // синхронизация при ручном свайпе
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const gap = getGap();
      const slideW = slides[0].offsetWidth;
      const newIndex = Math.round(track.scrollLeft / (slideW + gap));
      if (newIndex !== index) {
        index = Math.max(0, Math.min(newIndex, slides.length - 1));
        updateUI();
      }
    }, 80);
  }, { passive: true });

  window.addEventListener('resize', () => goTo(index));

  // старт
  track.scrollTo({ left: 0, behavior: 'instant' });
  updateUI();
}

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

/* Добавил новое от 29.10.2026 11:25
 */
// ===== HOTELS POPUP =====
(function () {
  const popup = document.getElementById('hotelsPopup');
  if (!popup) return;

  const openBtns = document.querySelectorAll('.js-open-hotels');
  const closeEls = popup.querySelectorAll('[data-close-hotels]');

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) {
      closePopup();
    }
  });
})();
