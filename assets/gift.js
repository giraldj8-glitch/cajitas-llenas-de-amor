/* =========================================================================
   Cajitas llenas de amor — gift.js
   Construye la caja de regalo 3D en el DOM.

   La caja es un CUBO BISELADO de verdad: 6 caras planas + 12 biseles a 45°
   que redondean las aristas (el look "clay" de un render 3D). El cuerpo va
   abierto por arriba y la tapa es otro cubo biselado, un poco más ancho,
   que se levanta y se aparta al abrir.

   Toda la geometría vive en box.css; aquí solo escupimos los elementos.
   ========================================================================= */

(function () {
  // Las 12 aristas de un cubo, por el par de caras que unen.
  const BEVELS = ['tf', 'tb', 'bf', 'bb', 'lf', 'rf', 'lb', 'rb', 'tl', 'tr', 'bl', 'br'];

  function el(cls, parent) {
    const node = document.createElement('span');
    node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  /**
   * Un cubo biselado. `faces` dice qué caras se pintan — el cuerpo omite
   * la de arriba porque está abierto.
   */
  function chamferedBox(cls, faces) {
    const box = document.createElement('span');
    box.className = cls;
    faces.forEach(f => el('face face--' + f, box));
    BEVELS.forEach(b => el('bv bv--' + b, box));
    return box;
  }

  function buildBow(parent) {
    const bow = el('bow', parent);
    el('bow__tail bow__tail--left', bow);
    el('bow__tail bow__tail--right', bow);
    el('bow__loop bow__loop--left', bow);
    el('bow__loop bow__loop--right', bow);
    el('bow__knot', bow);
    return bow;
  }

  /**
   * Arma la caja completa dentro de `host`.
   *   opts.mini    — versión reducida para las tarjetas de la landing
   *   opts.initials— iniciales para la etiqueta colgante
   */
  function buildGift(host, opts = {}) {
    if (!host) return null;
    host.innerHTML = '';
    host.classList.add('gift');

    // --- cuerpo: cubo biselado sin tapa + interior ---
    const body = chamferedBox('gift__body', ['front', 'back', 'left', 'right', 'bottom']);
    host.appendChild(body);

    if (!opts.mini) {
      ['front', 'back', 'left', 'right'].forEach(f => el('inner inner--' + f, body));
      el('gift__floor', body);

      // Las cartitas que salen volando de la caja al abrirla.
      // Si la persona aún no tiene mensajes, la caja va vacía de verdad.
      (opts.notes === false ? [] : ['a', 'b', 'c']).forEach(k => {
        const note = el('note note--' + k, body);
        el('note__line', note);
        el('note__line', note);
        el('note__line', note);
        el('note__heart', note);
      });

      if (opts.initials) {
        const tag = el('tag', body);
        const text = el('tag__text', tag);
        text.textContent = opts.initials;
        tag.dataset.giftTag = '';
      }
    } else {
      ['front', 'back', 'left', 'right'].forEach(f => el('inner inner--' + f, body));
      el('gift__floor', body);
    }

    // --- tapa: otro cubo biselado, completo ---
    const lid = chamferedBox('gift__lid', ['front', 'back', 'left', 'right', 'top', 'bottom']);
    host.appendChild(lid);
    buildBow(lid);

    return host;
  }

  window.buildGift = buildGift;
})();
