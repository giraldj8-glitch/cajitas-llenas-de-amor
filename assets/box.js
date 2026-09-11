/* =========================================================================
   Cajitas llenas de amor — box.js
   Parallax de la caja con el puntero + apertura (tapa, confeti, mensajes).
   ========================================================================= */

(function () {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.querySelector('.box-stage');
  const gift = stage && stage.querySelector('.gift');
  if (!stage || !gift) return;

  const messages = document.querySelector('.messages');
  const empty = document.querySelector('.empty');
  const cards = messages ? messages.querySelectorAll('.message') : [];
  const target = cards.length ? messages : empty;

  let opened = false;
  let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0, idle = 0;

  // --- Parallax -----------------------------------------------------------
  // El cubic-bezier del CSS suaviza; aquí solo perseguimos el objetivo.
  function tick() {
    const dx = tx - rx;
    const dy = ty - ry;
    rx += dx * 0.09;
    ry += dy * 0.09;
    gift.style.setProperty('--rx', rx.toFixed(2));
    gift.style.setProperty('--ry', ry.toFixed(2));

    // Dormimos el bucle cuando ya no hay movimiento pendiente.
    if (Math.abs(dx) < 0.02 && Math.abs(dy) < 0.02) {
      if (++idle > 20) { raf = 0; return; }
    } else {
      idle = 0;
    }
    raf = requestAnimationFrame(tick);
  }

  function wake() {
    if (!raf && !REDUCED) { idle = 0; raf = requestAnimationFrame(tick); }
  }

  function aim(clientX, clientY) {
    if (REDUCED) return;
    const r = stage.getBoundingClientRect();
    const nx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (clientY - (r.top + r.height / 2)) / (r.height / 2);
    const clamp = v => Math.max(-1, Math.min(1, v));
    // Al abrirse la caja bajamos la intensidad para no marear.
    const k = opened ? 0.35 : 1;
    tx = -clamp(ny) * 11 * k;
    ty =  clamp(nx) * 20 * k;
    wake();
  }

  stage.addEventListener('pointermove', e => aim(e.clientX, e.clientY), { passive: true });
  stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; wake(); }, { passive: true });

  // --- Apertura -----------------------------------------------------------
  function open() {
    if (opened) return;
    opened = true;
    tx = 0; ty = 0; wake();

    gift.classList.add('is-open');
    stage.classList.add('is-open');
    gift.setAttribute('aria-expanded', 'true');

    const fire = (delay, count) => setTimeout(() => {
      if (!window.cajitasConfetti) return;
      const r = gift.getBoundingClientRect();
      window.cajitasConfetti({
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        count
      });
    }, delay);

    if (!REDUCED) {
      fire(420, 150);   // al saltar la tapa
      fire(780, 90);    // segunda oleada
      fire(1150, 60);   // cola
    } else {
      fire(0, 60);
    }

    if (!target) return;

    cards.forEach((el, i) => {
      el.style.transitionDelay = (120 + i * 110) + 'ms';
    });

    setTimeout(() => {
      target.classList.add('is-visible');
      if (!REDUCED) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, REDUCED ? 200 : 1250);
  }

  gift.addEventListener('click', open);
  gift.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });

  // El contenedor del regalo lo crea gift.js, así que fijamos el rol aquí.
  gift.setAttribute('role', 'button');
  gift.setAttribute('tabindex', '0');
  gift.setAttribute('aria-expanded', 'false');
  gift.setAttribute('aria-label', 'Abrir el regalo y ver los mensajes');
})();
