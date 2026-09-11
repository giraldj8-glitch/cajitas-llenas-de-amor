/* =========================================================================
   Cajitas llenas de amor — app.js
   Renderiza la landing (rejilla de personas) o la página individual
   (caja + mensajes) según los elementos presentes.
   ========================================================================= */

(function () {
  const D = window.CAJITAS_DATA;
  if (!D) return;

  const root = document.documentElement;

  // ============================================================
  // Helper: iniciales de un nombre
  // ============================================================
  function getInitials(nombre) {
    return nombre
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  // ============================================================
  // Helper: color "burbuja" para el avatar de un remitente
  //   Usado en los mensajes para diferenciar de quién viene.
  // ============================================================
  const COLOR_TOKENS = ['--c-mint', '--c-cyan', '--c-blue', '--c-purple'];
  function colorTokenForName(nombre) {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0;
    }
    return COLOR_TOKENS[hash % COLOR_TOKENS.length];
  }
  function bubbleClassForToken(token) {
    switch (token) {
      case '--c-mint':   return 'message__from-bubble--mint';
      case '--c-cyan':   return 'message__from-bubble--cyan';
      case '--c-blue':   return 'message__from-bubble--blue';
      case '--c-purple': return 'message__from-bubble--purple';
      default:           return '';
    }
  }

  // ============================================================
  // Landing: pinta la rejilla de personas
  // ============================================================
  function renderLanding() {
    const grid = document.querySelector('[data-grid]');
    if (!grid) return;

    const html = D.orden.map(slug => {
      const p = D.personas[slug];
      if (!p) return '';
      const count = p.mensajes.length;
      const hasMsgs = count > 0;
      const countLabel = hasMsgs
        ? `${count} ${count === 1 ? 'mensaje' : 'mensajes'}`
        : 'Pronto';
      const page = `./${slug}.html`;

      return `
        <a class="person" href="${page}"
           style="--p-color: ${p.color}; --p-soft: ${p.colorSuave};"
           data-stagger>
          <span class="person__bubble">${p.iniciales || getInitials(p.nombre)}</span>
          <h2 class="person__name">${p.nombre}</h2>
          ${p.alias ? `<p class="person__alias">también conocido como “${p.alias}”</p>` : `<p class="person__alias">&nbsp;</p>`}
          <span class="person__count">
            ${hasMsgs ? `<strong>${count}</strong> ${count === 1 ? 'mensaje' : 'mensajes'}` : 'Pronto mensajes'}
          </span>
          <span class="person__cta">
            ${hasMsgs ? 'Abrir su caja' : 'Ver la caja'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
      `;
    }).join('');

    grid.innerHTML = html;

    // stagger de entrada
    requestAnimationFrame(() => {
      grid.querySelectorAll('[data-stagger]').forEach((el, i) => {
        el.style.transitionDelay = (i * 60) + 'ms';
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px) scale(0.98)';
        el.style.transition = 'opacity 500ms var(--ease-out), transform 500ms var(--ease-out)';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        });
      });
    });
  }

  // ============================================================
  // Página individual: pinta los mensajes y aplica tokens
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

    // Aplica color dinámico al documento (CSS custom prop)
    root.style.setProperty('--p-color', p.color);
    root.style.setProperty('--p-soft', p.colorSuave);

    // Título y saludo
    const titleEl = document.querySelector('[data-persona-name]');
    if (titleEl) titleEl.innerHTML = p.alias
      ? `Para <em>${p.alias}</em>`
      : `Para <em>${p.nombre}</em>`;

    const saludoEl = document.querySelector('[data-persona-greeting]');
    if (saludoEl) saludoEl.textContent = p.saludo;

    const subEl = document.querySelector('[data-persona-sub]');
    if (subEl) {
      subEl.textContent = p.mensajes.length
        ? `${p.mensajes.length} ${p.mensajes.length === 1 ? 'mensaje te han dedicado' : 'mensajes te han dedicado'} tus compañeros. Toca la caja para descubrirlos.`
        : `Tu caja se está preparando. Cuando estés listo/a, toca la caja.`;
    }

    // Initials en la tapa
    const initialsEl = document.querySelector('[data-persona-initials]');
    if (initialsEl) initialsEl.textContent = p.iniciales || getInitials(p.nombre);

    // Lista de mensajes o empty state
    const list = document.querySelector('[data-persona-messages]');
    const empty = document.querySelector('[data-persona-empty]');
    const titleBar = document.querySelector('[data-persona-messages-title]');
    const countEl = document.querySelector('[data-persona-messages-count]');

    if (p.mensajes.length === 0) {
      if (list) list.remove();
      // el empty state se mostrará desde box.js al abrir
    } else {
      if (empty) empty.remove();
      const html = p.mensajes.map(m => {
        const token = colorTokenForName(m.de);
        const bubbleClass = bubbleClassForToken(token);
        const initials = getInitials(m.de);
        return `
          <article class="message">
            <div class="message__from">
              <span class="message__from-bubble ${bubbleClass}" style="--p-color: var(${token});">${initials}</span>
              <span>De ${m.alias || m.de}</span>
            </div>
            <p class="message__body">${m.texto}</p>
          </article>
        `;
      }).join('');
      if (list) list.innerHTML = html;
      if (titleBar) titleBar.hidden = false;
      if (countEl) {
        countEl.textContent = `${p.mensajes.length} ${p.mensajes.length === 1 ? 'mensaje' : 'mensajes'}`;
      }
    }

    // Tabs title del documento
    document.title = `${p.alias || p.nombre} · ${D.equipo}`;
  }

  // ============================================================
  // Boot
  // ============================================================
  renderLanding();
  renderPersona();
})();
