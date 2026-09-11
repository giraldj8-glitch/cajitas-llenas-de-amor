/* =========================================================================
   Cajitas llenas de amor — box.js
   Lógica de la caja 3D: parallax con el mouse, apertura con confeti,
   scroll automático a los mensajes.
   ========================================================================= */

(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = document.querySelector('.box');
  const stage = document.querySelector('.box-stage');
  const messages = document.querySelector('.messages');
  const empty = document.querySelector('.empty');
  const hint = document.querySelector('.hint');

  if (!box || !stage) return;

  let opened = false;
  let rx = 0, ry = 0;
  let targetRx = 0, targetRy = 0;
  let raf;

  // ----- Parallax con el mouse -------------------------------------------
  function onMove(e) {
    if (opened || REDUCED) return;
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = (e.clientX - cx) / rect.width;  // -0.5 .. 0.5
    const py = (e.clientY - cy) / rect.height;
    targetRy = px * 22;
    targetRx = -py * 12;
  }

  function onLeave() {
    if (opened) return;
    targetRx = 0;
    targetRy = 0;
  }

  function loop() {
    rx += (targetRx - rx) * 0.12;
    ry += (targetRy - ry) * 0.12;
    box.style.setProperty('--rx', rx.toFixed(2));
    box.style.setProperty('--ry', ry.toFixed(2));
    raf = requestAnimationFrame(loop);
  }

  // ----- Apertura --------------------------------------------------------
  function openBox() {
    if (opened) return;
    opened = true;

    const rect = box.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    box.classList.add('is-open');
    stage.classList.add('is-open');

    // Confeti en 2 oleadas para que se vea más
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

    if (hint) hint.classList.add('is-hidden');

    targetRx = 0;
    targetRy = 0;

    // Mostrar mensajes con delay para que la tapa se aprecie abriendo
    if (messages && messages.querySelectorAll('.message').length > 0) {
      const items = messages.querySelectorAll('.message');
      items.forEach((el, i) => {
        el.style.transitionDelay = (220 + i * 110) + 'ms';
      });
      setTimeout(() => {
        messages.classList.add('is-visible');
        if (!REDUCED) {
          const top = messages.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 850);
    } else if (empty) {
      setTimeout(() => {
        empty.classList.add('is-visible');
        if (!REDUCED) {
          const top = empty.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 600);
    }
  }

  // ----- Listeners -------------------------------------------------------
  stage.addEventListener('mousemove', onMove, { passive: true });
  stage.addEventListener('mouseleave', onLeave, { passive: true });
  box.addEventListener('click', openBox);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBox();
    }
  });

  box.setAttribute('tabindex', '0');
  box.setAttribute('role', 'button');
  box.setAttribute('aria-label', 'Abrir la caja y descubrir los mensajes');

  if (matchMedia('(hover: none)').matches) {
    box.style.cursor = 'pointer';
  }

  if (!REDUCED) {
    loop();
  }
})();
