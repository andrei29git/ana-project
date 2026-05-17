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

  function openSecret() {
    document.getElementById('modal-overlay').classList.add('open');
    document.getElementById('secret-modal').classList.add('open');
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

  document.addEventListener('click', (e) => {
    const i = petalAt(e.clientX, e.clientY);
    if (i !== -1) { petals.splice(i, 1); openSecret(); }
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
