/* =========================================================================
   Cajitas llenas de amor — confetti.js
   Confeti en canvas sin dependencias. Toma una paleta de colores en CSS
   (--p-color, --p-soft, --c-mint, --c-cyan, --c-purple).
   ========================================================================= */

(function () {
  const TAU = Math.PI * 2;

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function readPalette(root) {
    const cs = getComputedStyle(root);
    return [
      cs.getPropertyValue('--p-color').trim(),
      cs.getPropertyValue('--p-soft').trim(),
      cs.getPropertyValue('--c-mint').trim(),
      cs.getPropertyValue('--c-cyan').trim(),
      cs.getPropertyValue('--c-purple').trim()
    ].filter(Boolean);
  }

  function createCanvas() {
    let canvas = document.querySelector('.confetti');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'confetti';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return { canvas, ctx };
  }

  function burst(opts = {}) {
    const { canvas, ctx } = createCanvas();
    const palette = readPalette(document.documentElement);
    const cx = opts.x ?? window.innerWidth / 2;
    const cy = opts.y ?? window.innerHeight / 2;
    const count = opts.count ?? 120;
    const colors = opts.colors && opts.colors.length ? opts.colors : palette;
    const particles = [];

    for (let i = 0; i < count; i++) {
      const angle = rand(-Math.PI, 0); // hacia arriba
      const speed = rand(6, 14);
      particles.push({
        x: cx + rand(-30, 30),
        y: cy + rand(-10, 10),
        vx: Math.cos(angle) * speed * rand(0.6, 1.2),
        vy: Math.sin(angle) * speed * rand(0.8, 1.4) - rand(2, 6),
        gravity: 0.18,
        drag: 0.992,
        size: rand(6, 11),
        color: pick(colors),
        rot: rand(0, TAU),
        vr: rand(-0.2, 0.2),
        life: 0,
        maxLife: rand(140, 220),
        shape: Math.random() < 0.35 ? 'rect' : (Math.random() < 0.5 ? 'circle' : 'ribbon')
      });
    }

    // confeti lateral para más vistosidad
    for (let i = 0; i < count / 2; i++) {
      particles.push({
        x: rand(0, window.innerWidth),
        y: -20,
        vx: rand(-1, 1),
        vy: rand(1, 3),
        gravity: 0.05,
        drag: 0.995,
        size: rand(6, 10),
        color: pick(colors),
        rot: rand(0, TAU),
        vr: rand(-0.1, 0.1),
        life: 0,
        maxLife: 320,
        shape: 'rect'
      });
    }

    let raf;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      for (const p of particles) {
        p.life++;
        if (p.life > p.maxLife) continue;
        alive++;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        const alpha = 1 - (p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, TAU);
          ctx.fill();
        } else {
          // ribbon
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.quadraticCurveTo(0, -p.size / 2, p.size, 0);
          ctx.quadraticCurveTo(0, p.size / 2, -p.size, 0);
          ctx.fill();
        }
        ctx.restore();
      }
      if (alive > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    cancelAnimationFrame(window.__confettiRaf || 0);
    window.__confettiRaf = requestAnimationFrame(tick);
  }

  window.cajitasConfetti = burst;
})();
