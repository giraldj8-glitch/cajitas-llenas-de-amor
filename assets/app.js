/* =========================================================================
   Cajitas llenas de amor — app.js
   Pinta la landing (rejilla de personas) o la página individual
   (regalo + mensajes) según los elementos presentes en el documento.
   ========================================================================= */

(function () {
  const D = window.CAJITAS_DATA;
  if (!D) return;

  const root = document.documentElement;

  // ============================================================
  // Helpers
  // ============================================================
  function getInitials(nombre) {
    return nombre
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Color "burbuja" para el avatar de quien firma un mensaje
  const COLOR_TOKENS = ['--c-mint', '--c-cyan', '--c-blue', '--c-purple'];
  function colorTokenForName(nombre) {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0;
    }
    return COLOR_TOKENS[hash % COLOR_TOKENS.length];
  }
  function bubbleClassForToken(token) {
    return {
      '--c-mint': 'message__from-bubble--mint',
      '--c-cyan': 'message__from-bubble--cyan',
      '--c-blue': 'message__from-bubble--blue',
      '--c-purple': 'message__from-bubble--purple'
    }[token] || '';
  }

  // ============================================================
  // Landing: rejilla de personas, cada una con su cajita mini
  // ============================================================
  function renderLanding() {
    const grid = document.querySelector('[data-grid]');
    if (!grid) return;

    grid.innerHTML = D.orden.map(slug => {
      const p = D.personas[slug];
      if (!p) return '';
      const count = p.mensajes.length;
      const hasMsgs = count > 0;

      return `
        <a class="person" href="./${slug}.html" data-stagger
           style="--p-color: ${p.color}; --p-soft: ${p.colorSuave};">
          <span class="gift-mini" data-mini-gift aria-hidden="true"></span>
          <h2 class="person__name">${escapeHtml(p.nombre)}</h2>
          ${p.alias ? `<p class="person__alias">para todos, “${escapeHtml(p.alias)}”</p>` : ''}
          <span class="person__count">
            ${hasMsgs ? `<strong>${count}</strong> ${count === 1 ? 'mensaje' : 'mensajes'}` : 'Pronto mensajes'}
          </span>
          <span class="person__cta">
            ${hasMsgs ? 'Abrir su regalo' : 'Ver su caja'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
      `;
    }).join('');

    // Cajita 3D dentro de cada tarjeta
    if (window.buildGift) {
      grid.querySelectorAll('[data-mini-gift]').forEach(host => {
        const inner = document.createElement('span');
        host.appendChild(inner);
        window.buildGift(inner, { mini: true });
      });
    }

    // Entrada escalonada. Al terminar limpiamos los estilos inline: si se
    // quedan, el `transform` de la tarjeta gana siempre y mata el :hover.
    requestAnimationFrame(() => {
      grid.querySelectorAll('[data-stagger]').forEach((el, i) => {
        const delay = i * 60;
        el.style.transitionDelay = delay + 'ms';
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        el.style.transition = 'opacity 560ms var(--ease-out), transform 560ms var(--ease-out)';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
        setTimeout(() => {
          ['transition-delay', 'opacity', 'transform', 'transition']
            .forEach(prop => el.style.removeProperty(prop));
        }, delay + 640);
      });
    });
  }

  // ============================================================
  // Página individual
  // ============================================================
  function renderPersona() {
    const personaRoot = document.querySelector('[data-persona]');
    if (!personaRoot) return;

    const slug = personaRoot.dataset.persona;
    const p = D.personas[slug];
    if (!p) {
      console.warn('Persona no encontrada:', slug);
      return;
    }

    const count = p.mensajes.length;
    const initials = p.iniciales || getInitials(p.nombre);

    // Color de la persona para toda la página
    root.style.setProperty('--p-color', p.color);
    root.style.setProperty('--p-soft', p.colorSuave);

    // Encabezado
    const saludoEl = document.querySelector('[data-persona-greeting]');
    if (saludoEl) saludoEl.textContent = 'Para ' + (p.alias || p.nombre);

    const subEl = document.querySelector('[data-persona-sub]');
    if (subEl) {
      subEl.textContent =
        count === 0 ? 'Tu caja se está preparando. Cuando estés listo/a, ábrela.'
      : count === 1 ? 'Adentro hay un mensaje esperándote. Toca la caja para abrirla.'
      : `Adentro hay ${count} mensajes de tus compañeros. Toca la caja para abrirla.`;
    }

    // El regalo 3D
    const giftHost = document.querySelector('[data-gift]');
    if (giftHost && window.buildGift) {
      window.buildGift(giftHost, { initials, notes: count > 0 });
    }

    // Mensajes / caja vacía
    const list = document.querySelector('[data-persona-messages]');
    const empty = document.querySelector('[data-persona-empty]');

    if (count === 0) {
      if (list) list.remove();
      if (empty) empty.hidden = false;
    } else {
      if (empty) empty.remove();
      if (list) {
        list.hidden = false;
        if (count === 1) list.classList.add('messages--single');

        const title = `
          <h2 class="messages__title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="messages__title-text">${count === 1 ? 'Un mensaje para ti' : 'Mensajes para ti'}</span>
            <span class="messages__count">${count} ${count === 1 ? 'mensaje' : 'mensajes'}</span>
          </h2>`;

        const cards = p.mensajes.map(m => {
          if (m.de) {
            const token = colorTokenForName(m.de);
            return `
              <article class="message">
                <div class="message__from">
                  <span class="message__from-bubble ${bubbleClassForToken(token)}"
                        style="--p-color: var(${token});">${escapeHtml(getInitials(m.de))}</span>
                  <span>De ${escapeHtml(m.alias || m.de)}</span>
                </div>
                <p class="message__body">${escapeHtml(m.texto)}</p>
              </article>`;
          }
          return `
            <article class="message message--solo">
              <span class="message__eyebrow">Un mensaje para ti</span>
              <p class="message__body">${escapeHtml(m.texto)}</p>
              <span class="message__signature">Con cariño, del equipo</span>
            </article>`;
        }).join('');

        // El título va dentro de .messages para compartir la animación de
        // entrada, y se arma junto con las tarjetas en un solo innerHTML
        // (antes se pintaba aparte y el innerHTML de las tarjetas lo borraba).
        list.innerHTML = (count === 1 ? '' : title) + cards;
      }
    }

    document.title = `El equipo te envió un regalo · ${p.alias || p.nombre}`;
  }

  renderLanding();
  renderPersona();
})();
