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
    targetRy = px * 18;   // gira más en Y
    targetRx = -py * 10;  // gira menos en X
  }

  function onLeave() {
    if (opened) return;
    targetRx = 0;
    targetRy = 0;
  }

  // Suavizado con rAF (en lugar de saltar)
  function loop() {
    rx += (targetRx - rx) * 0.12;
    ry += (targetRy - ry) * 0.12;
    box.style.setProperty('--rx', rx.toFixed(2));
    box.style.setProperty('--ry', ry.toFixed(2));
    raf = requestAnimationFrame(loop);
  }

  // ----- Apertura --------------------------------------------------------
  function openBox(e) {
    if (opened) return;
    opened = true;

    // Cálculo del centro para confeti
    const rect = box.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    box.classList.add('is-open');
    stage.classList.add('is-open');

    // Lanzar confeti
    if (window.cajitasConfetti) {
      window.cajitasConfetti({ x: cx, y: cy });
    }

    // Ocultar hint
    if (hint) hint.classList.add('is-hidden');

    // Quitar parallax cuando está abierta
    targetRx = 0;
    targetRy = 0;

    // Mostrar mensajes
    if (messages) {
      // stagger via data-attr
      const items = messages.querySelectorAll('.message');
      items.forEach((el, i) => {
        el.style.transitionDelay = (120 + i * 80) + 'ms';
      });
      // pequeño delay para que la tapa se vea abriendo
      setTimeout(() => {
        messages.classList.add('is-visible');
        // scroll suave a los mensajes
        if (!REDUCED) {
          const top = messages.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 700);
    } else if (empty) {
      setTimeout(() => empty.classList.add('is-visible'), 500);
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

  // accesibilidad: que la caja sea focusable
  box.setAttribute('tabindex', '0');
  box.setAttribute('role', 'button');
  box.setAttribute('aria-label', 'Abrir la caja y descubrir los mensajes');

  // Touch: en táctil no hay mousemove, pero al primer tap la caja se centra
  if (matchMedia('(hover: none)').matches) {
    box.style.cursor = 'pointer';
  }

  if (!REDUCED) {
    loop();
  }
})();
