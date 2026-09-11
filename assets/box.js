/* =========================================================================
   Cajitas llenas de amor — box.js
   Parallax con mouse + apertura con confeti + reveal de mensajes.
   ========================================================================= */

(function () {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = document.querySelector('.box');
  const stage = document.querySelector('.box-stage');
  if (!box || !stage) return;

  const messages = document.querySelector('.messages');
  const empty = document.querySelector('.empty');
  const hint = document.querySelector('.hint');
  const hasMessages = messages && messages.querySelectorAll('.message').length > 0;

  let opened = false;
  let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0;

  // Parallax — el cubic-bezier del CSS hace la mayor parte del suavizado,
  // aquí solo animamos las custom properties hacia el target.
  function tick() {
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    box.style.setProperty('--rx', rx.toFixed(2));
    box.style.setProperty('--ry', ry.toFixed(2));
    raf = requestAnimationFrame(tick);
  }

  function onMove(e) {
    if (opened || REDUCED) return;
    const r = stage.getBoundingClientRect();
    tx = -((e.clientY - (r.top + r.height / 2)) / r.height) * 14;
    ty = ((e.clientX - (r.left + r.width / 2)) / r.width) * 22;
  }

  function onLeave() { if (!opened) { tx = 0; ty = 0; } }

  function openBox() {
    if (opened) return;
    opened = true;
    tx = 0; ty = 0;

    const r = box.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    box.classList.add('is-open');
    stage.classList.add('is-open');
    if (hint) hint.classList.add('is-hidden');

    // 2 oleadas de confeti para más vistosidad
    if (window.cajitasConfetti) {
      window.cajitasConfetti({ x: cx, y: cy, count: 160 });
      setTimeout(() => {
        const r2 = box.getBoundingClientRect();
        window.cajitasConfetti({
          x: r2.left + r2.width / 2,
          y: r2.top + r2.height / 2,
          count: 90
        });
      }, 350);
    }

    const target = hasMessages ? messages : empty;
    if (!target) return;

    if (hasMessages) {
      messages.querySelectorAll('.message').forEach((el, i) => {
        el.style.transitionDelay = (220 + i * 110) + 'ms';
      });
    }

    const delay = hasMessages ? 850 : 600;
    setTimeout(() => {
      target.classList.add('is-visible');
      if (!REDUCED) {
        const top = target.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, delay);
  }

  // Listeners
  stage.addEventListener('mousemove', onMove, { passive: true });
  stage.addEventListener('mouseleave', onLeave, { passive: true });
  box.addEventListener('click', openBox);
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(); }
  });

  // Accesibilidad
  box.setAttribute('tabindex', '0');
  box.setAttribute('role', 'button');
  box.setAttribute('aria-label', 'Abrir la caja y descubrir los mensajes');
  if (matchMedia('(hover: none)').matches) box.style.cursor = 'pointer';

  if (!REDUCED) raf = requestAnimationFrame(tick);
})();
