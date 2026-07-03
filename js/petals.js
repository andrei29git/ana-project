/* Petal rain - slow, soft, dusty rose. Every 27th petal is the
   easter egg: a deeper wine petal that opens the secret on click. */

(function () {
  const canvas = document.getElementById('petal-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const petals = [];
  let spawned = 0;
  const MAX_PETALS = 34;
  const EASTER_EGG_INTERVAL = 27;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makePetal() {
    spawned++;
    const isSecret = spawned % EASTER_EGG_INTERVAL === 0;
    return {
      x: Math.random() * W,
      y: -30,
      size: isSecret ? 13 : 5 + Math.random() * 8,
      speedY: 0.45 + Math.random() * 0.75,
      speedX: (Math.random() - 0.5) * 0.45,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.012 + Math.random() * 0.01,
      isSecret,
      color: isSecret
        ? 'rgba(122,39,56,0.9)'
        : `rgba(${210 + (Math.random()*25|0)},${150 + (Math.random()*30|0)},${150 + (Math.random()*20|0)},${0.35 + Math.random()*0.3})`,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    if (p.isSecret) {
      ctx.shadowColor = 'rgba(122,39,56,0.55)';
      ctx.shadowBlur = 12;
    }
    ctx.fill();
    ctx.restore();
  }

  // canvas has pointer-events:none, so detect hits at the document level
  function petalAt(cx, cy) {
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      if (!p.isSecret) continue;
      if (Math.hypot(cx - p.x, cy - p.y) < p.size * 1.7) return i;
    }
    return -1;
  }

  // self-contained toast (petals.js runs on every page, but gsap and
  // easter-eggs.js's window.showNoSecret don't, so this can't lean on those)
  function noSecretToast(e) {
    const toast = document.createElement('p');
    toast.textContent = 'no secret… for now…';
    Object.assign(toast.style, {
      position: 'fixed',
      fontFamily: "'Fraunces', serif",
      fontStyle: 'italic',
      fontSize: '1rem',
      color: 'var(--ivory, #f3e8d4)',
      textShadow: '0 1px 8px rgba(0,0,0,0.7)',
      pointerEvents: 'none',
      zIndex: 9999,
      whiteSpace: 'nowrap',
      left: ((e && e.clientX) || window.innerWidth  / 2) + 'px',
      top:  ((e && e.clientY) || window.innerHeight / 2) + 'px',
      transform: 'translate(-50%, -50%)',
      opacity: '0',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, calc(-50% - 18px))';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, calc(-50% - 34px))';
      setTimeout(() => toast.remove(), 500);
    }, 1400);
  }

  document.addEventListener('click', (e) => {
    const i = petalAt(e.clientX, e.clientY);
    if (i !== -1) {
      petals.splice(i, 1);
      // used to be a secret shortcut to the games page - games is
      // reachable from the desk now, so this is just a wink
      noSecretToast(e);
    }
  }, true); // capture phase - fires before other handlers

  let frame = 0;
  function loop() {
    ctx.clearRect(0, 0, W, H);

    if (petals.length < MAX_PETALS && frame % 22 === 0) petals.push(makePetal());

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.4;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > H + 40) {
        petals.splice(i, 1);
        petals.push(makePetal());
        continue;
      }
      drawPetal(p);
    }
    frame++;
    requestAnimationFrame(loop);
  }
  loop();
})();
