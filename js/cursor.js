/* Sparkle particle trail that follows the mouse */

(function () {
  const container = document.getElementById('sparkle-container');
  const GLYPHS = ['✦', '✶', '·', '✦'];
  let last = { x: -100, y: -100 };
  let throttle = false;

  document.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;
    setTimeout(() => { throttle = false; }, 55);

    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    if (Math.hypot(dx, dy) < 14) return;
    last = { x: e.clientX, y: e.clientY };

    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
    s.style.left = e.clientX + (Math.random() * 16 - 8) + 'px';
    s.style.top  = e.clientY + (Math.random() * 16 - 8) + 'px';
    s.style.fontSize = (5 + Math.random() * 7) + 'px';
    s.style.color = Math.random() > 0.5 ? '#ab7f37' : '#d49a9b';
    container.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });
})();
