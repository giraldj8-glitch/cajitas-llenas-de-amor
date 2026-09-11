/* =========================================================================
   Cajitas llenas de amor — confetti.js
   Confeti en canvas, sin dependencias. Toma la paleta de las variables CSS
   (--p-color, --p-soft, --c-mint, --c-cyan, --c-purple).

   Hay UN solo bucle y UN solo pozo de partículas: así varias oleadas
   seguidas se suman en vez de borrarse entre ellas.
   ========================================================================= */

(function () {
  const TAU = Math.PI * 2;
  const MAX = 700;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  let canvas = null, ctx = null, raf = 0;
  const pool = [];

  function palette() {
    const cs = getComputedStyle(document.documentElement);
    return ['--p-color', '--p-soft', '--c-mint', '--c-cyan', '--c-purple']
      .map(v => cs.getPropertyValue(v).trim())
      .filter(Boolean);
  }

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.querySelector('.confetti');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'confetti';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
    }
    ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
  }

  function draw(p) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, (1 - p.life / p.maxLife) * 2.2);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    // Escalar en X simula el giro del papelito sobre su propio eje.
    ctx.scale(Math.cos(p.spin) * 0.85 + 0.15, 1);
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2.4, 0, TAU);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.quadraticCurveTo(0, -p.size / 2, p.size, 0);
      ctx.quadraticCurveTo(0, p.size / 2, -p.size, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = pool.length - 1; i >= 0; i--) {
      const p = pool[i];
      p.life++;
      if (p.life > p.maxLife || p.y > window.innerHeight + 60) {
        pool.splice(i, 1);
        continue;
      }
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.spin += p.vs;
      draw(p);
    }

    if (pool.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function burst(opts = {}) {
    ensureCanvas();

    const cx = opts.x ?? window.innerWidth / 2;
    const cy = opts.y ?? window.innerHeight / 2;
    const count = opts.count ?? 120;
    const colors = (opts.colors && opts.colors.length) ? opts.colors : palette();
    if (!colors.length) return;

    // Chorro hacia arriba desde la boca de la caja
    for (let i = 0; i < count && pool.length < MAX; i++) {
      const angle = rand(-Math.PI * 0.92, -Math.PI * 0.08);
      const speed = rand(7, 16);
      pool.push({
        x: cx + rand(-26, 26),
        y: cy + rand(-12, 12),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(2, 7),
        gravity: 0.19,
        drag: 0.991,
        size: rand(6, 12),
        color: pick(colors),
        rot: rand(0, TAU),
        vr: rand(-0.22, 0.22),
        spin: rand(0, TAU),
        vs: rand(0.06, 0.16),
        life: 0,
        maxLife: rand(150, 240),
        shape: Math.random() < 0.4 ? 'rect' : (Math.random() < 0.5 ? 'circle' : 'ribbon')
      });
    }

    // Lluvia desde arriba, para llenar la pantalla
    for (let i = 0; i < count / 2 && pool.length < MAX; i++) {
      pool.push({
        x: rand(0, window.innerWidth),
        y: rand(-80, -10),
        vx: rand(-1.2, 1.2),
        vy: rand(1.5, 3.5),
        gravity: 0.045,
        drag: 0.996,
        size: rand(5, 10),
        color: pick(colors),
        rot: rand(0, TAU),
        vr: rand(-0.12, 0.12),
        spin: rand(0, TAU),
        vs: rand(0.04, 0.1),
        life: 0,
        maxLife: 340,
        shape: 'rect'
      });
    }

    if (!raf) raf = requestAnimationFrame(tick);
  }

  window.cajitasConfetti = burst;
})();
