/* Apology video modal. Exposes window.openApology(event?) so the
   existing easter eggs (star, 27th petal, triple-click countdown)
   can fire it. The modal springs out from the click point. */

(function () {
  const overlay  = document.getElementById('apology-overlay');
  const wrap     = document.getElementById('apology-wrap');
  const modal    = document.getElementById('apology-modal');
  const closeBtn = document.getElementById('apology-modal-close');
  const video    = document.getElementById('apology-video');
  if (!wrap || !modal) return;

  function open(e) {
    // capture the click point so the modal appears to spring out of it
    let jumpX = 0, jumpY = 0;
    if (e && typeof e.clientX === 'number' && e.clientX > 0) {
      jumpX = e.clientX - window.innerWidth  / 2;
      jumpY = e.clientY - window.innerHeight / 2;
    }
    modal.style.setProperty('--jump-x', jumpX + 'px');
    modal.style.setProperty('--jump-y', jumpY + 'px');

    overlay.classList.add('open');
    requestAnimationFrame(() => wrap.classList.add('open'));
    document.body.style.overflow = 'hidden';

    // pause any timeline videos that may be playing
    document.querySelectorAll('.tl-photo video').forEach(v => v.pause());

    try { video.currentTime = 0; } catch (_) {}
    video.play().catch(() => {});
  }

  function close() {
    overlay.classList.remove('open');
    wrap.classList.remove('open');
    document.body.style.overflow = '';
    video.pause();
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrap.classList.contains('open')) close();
  });

  window.openApology = open;
})();
