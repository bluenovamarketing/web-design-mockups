const header = document.querySelector('#site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const temperatureValue = document.querySelector('#temperature-value');
const temperatureLabel = document.querySelector('#dial-label');
const scaleProgress = document.querySelector('#scale-progress');

const mixColor = (start, end, progress) => start.map((value, index) => Math.round(value + ((end[index] - value) * progress))).join(' ');

const setTemperature = (temperature, direction = 1) => {
  const clamped = Math.max(67, Math.min(74, temperature));
  const progress = (clamped - 67) / 7;
  const angle = -126 + (progress * 252);
  hero?.style.setProperty('--hero-a', mixColor([4, 28, 55], [64, 10, 14], progress));
  hero?.style.setProperty('--hero-b', mixColor([7, 83, 143], [190, 44, 34], progress));
  hero?.style.setProperty('--hero-c', mixColor([10, 45, 82], [232, 78, 48], progress));
  hero?.style.setProperty('--ice-opacity', String(Math.max(.04, 1 - (progress * 1.18))));
  hero?.style.setProperty('--heat-opacity', String(Math.max(0, (progress - .12) * 1.14)));
  hero?.style.setProperty('--air-opacity', String(.36 - (progress * .17)));
  hero?.style.setProperty('--cold-scene-opacity', String(Math.max(.06, 1 - progress)));
  hero?.style.setProperty('--hot-scene-opacity', String(Math.max(.04, progress)));
  hero?.style.setProperty('--dial-angle', `${angle}deg`);
  if (temperatureValue) temperatureValue.textContent = String(Math.round(clamped));
  if (scaleProgress) scaleProgress.style.width = `${Math.max(2, progress * 100)}%`;
  if (temperatureLabel) {
    temperatureLabel.textContent = clamped < 68 ? 'Cooling' : clamped < 73 ? 'Comfort zone' : 'Heating';
  }
};

let cycleStart = performance.now();
const cycleDuration = 22000;

const animateTemperature = (time) => {
  const phase = ((time - cycleStart) % cycleDuration) / cycleDuration;
  const rising = phase < 0.5;
  const progress = rising ? phase * 2 : (1 - phase) * 2;
  setTemperature(67 + (progress * 7), rising ? 1 : -1);
  window.requestAnimationFrame(animateTemperature);
};

setTemperature(67, 1);
window.requestAnimationFrame(animateTemperature);

const closeNav = () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('nav-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
window.addEventListener('resize', () => { if (window.innerWidth > 820) closeNav(); });
window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 18), { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const willOpen = !item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
    if (willOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const finePointer = window.matchMedia('(pointer: fine)');
const heroTilt = document.querySelector('[data-hero-tilt]');

if (heroTilt && finePointer.matches && window.innerWidth > 820) {
  heroTilt.addEventListener('pointermove', (event) => {
    const rect = heroTilt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroTilt.style.setProperty('--tilt-x', `${y * -11}deg`);
    heroTilt.style.setProperty('--tilt-y', `${x * 14}deg`);
    hero?.style.setProperty('--pointer-x', `${x * -16}px`);
    hero?.style.setProperty('--pointer-y', `${y * -12}px`);
  });
  heroTilt.addEventListener('pointerleave', () => {
    heroTilt.style.setProperty('--tilt-x', '0deg');
    heroTilt.style.setProperty('--tilt-y', '0deg');
    hero?.style.setProperty('--pointer-x', '0px');
    hero?.style.setProperty('--pointer-y', '0px');
  });
}

if (finePointer.matches) {
  document.querySelectorAll('[data-tilt-card]').forEach((card) => {
    const strength = Number(card.dataset.tiltStrength || 7);
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--card-tilt-x', `${y * -strength}deg`);
      card.style.setProperty('--card-tilt-y', `${x * strength}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--card-tilt-x', '0deg');
      card.style.setProperty('--card-tilt-y', '0deg');
    });
  });
}

