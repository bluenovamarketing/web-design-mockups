const body = document.body;
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

toggle?.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll('.reveal').forEach((element) => {
  if (observer) observer.observe(element);
  else element.classList.add('is-visible');
});

const heroMedia = document.querySelector('[data-tilt]');
const precisePointer = window.matchMedia('(pointer:fine)').matches;
if (heroMedia && precisePointer) {
  heroMedia.addEventListener('pointermove', (event) => {
    const rect = heroMedia.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroMedia.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
    heroMedia.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`);
  });
  heroMedia.addEventListener('pointerleave', () => {
    heroMedia.style.setProperty('--rx', '0deg');
    heroMedia.style.setProperty('--ry', '0deg');
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
