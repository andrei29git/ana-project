// ────────────────────────────────────────────────────────────
// the desk · proof of concept
// ────────────────────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger);

const stage       = document.querySelector('#desk-stage');
const letterEl    = document.querySelector('#proxy-letter');
const folded      = document.querySelector('#proxy-folded');
const foldedLabel = document.querySelector('#proxy-folded-label');
const desk        = document.querySelector('#desk-svg');
const items       = gsap.utils.toArray('.desk-item');
const hint        = document.querySelector('#desk-hint');

// ───── position every desk item via GSAP so transforms live in one place ─────
items.forEach(item => {
  const x = parseFloat(item.dataset.posX);
  const y = parseFloat(item.dataset.posY);
  const r = parseFloat(item.dataset.posR);
  gsap.set(item, {
    x, y, rotation: r,
    transformOrigin: '50% 50%',
    scale: 0.88,
    opacity: 0,
  });
});

// desk starts hidden; letter starts huge; folded note starts small + hidden
gsap.set(desk,        { opacity: 0 });
gsap.set(letterEl,    { scale: 1.75 });
gsap.set(folded,      { scale: 0.65, opacity: 0 });
gsap.set(foldedLabel, { opacity: 0 });
gsap.set(hint,        { opacity: 0 });

// ───── the pull-back: scrub the letter shrinking + desk revealing ─────
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: stage,
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 0.7,
    anticipatePin: 1,
  }
});

tl.to(letterEl, { scale: 0.42, ease: 'power2.inOut', duration: 1.2 }, 0)
  .to(desk,     { opacity: 1, ease: 'power2.out', duration: 0.9 }, 0.25)
  .to(items,    { opacity: 1, scale: 1, ease: 'back.out(1.3)', stagger: 0.07, duration: 0.7 }, 0.55)
  // crossfade: small open letter dissolves into a closed/folded one
  .to(letterEl, { opacity: 0, ease: 'power2.in', duration: 0.4 }, 1.0)
  .to(folded,      { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.5 }, 0.95)
  .to(hint,        { opacity: 0.72, ease: 'power2.out', duration: 0.5 }, 1.5)
  // linger: empty tween extends timeline so desk stays revealed before pin releases
  .to({}, { duration: 0.8 });

// ───── hover lift on each item ─────
items.forEach(item => {
  item.addEventListener('mouseenter', () => {
    gsap.to(item, {
      scale: 1.08,
      duration: 0.32,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });
  item.addEventListener('mouseleave', () => {
    gsap.to(item, {
      scale: 1,
      duration: 0.32,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  });
  item.addEventListener('click', () => openOverlay(item.dataset.chapter));
});

// ───── overlays ─────

// Lock page scroll without touching position — position: fixed confuses
// ScrollTrigger and resets the pinned desk animation. overflow: hidden on
// both html and body, plus overscroll-behavior: contain on the overlay,
// is enough to keep the page underneath frozen.
function lockBodyScroll() {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

function openOverlay(chapter) {
  const overlay = document.querySelector(`#overlay-${chapter}`);
  if (!overlay) return;

  // Inside fixed overlays, ScrollTriggers never fire from window scroll, so
  // gsap.from animations leave elements stuck in their "from" state.
  // Forcing each animation to progress(1) cleanly resolves them to their
  // natural state — including SVG attribute transforms (map pins, etc.)
  // which clearProps would otherwise destroy.
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger && overlay.contains(st.trigger)) {
      st.animation.progress(1);
    }
  });

  overlay.classList.add('open');
  overlay.scrollTop = 0;
  lockBodyScroll();
}

function closeAllOverlays() {
  document.querySelectorAll('.chapter-overlay.open')
    .forEach(o => o.classList.remove('open'));

  // The map panel uses pointer-events: auto when .map-panel--open, which
  // *overrides* the parent chapter-overlay's pointer-events: none. Without
  // explicitly resetting it, the invisible panel + its memory LIs keep
  // capturing clicks across the desk after the map is closed.
  const mapPanel = document.getElementById('map-panel');
  if (mapPanel) mapPanel.classList.remove('map-panel--open');

  const mapList = document.getElementById('map-panel-list');
  if (mapList) mapList.innerHTML = '';

  document.querySelectorAll('.map-pin--active')
    .forEach(p => p.classList.remove('map-pin--active'));

  // Forcefully kill any nested modal (memory modal from map, secret modal).
  const killModal = (el) => {
    if (!el) return;
    el.classList.remove('open');
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
  };
  killModal(document.getElementById('memory-overlay'));
  killModal(document.getElementById('memory-wrap'));
  killModal(document.getElementById('modal-overlay'));
  killModal(document.getElementById('secret-modal'));

  const memModal = document.getElementById('memory-modal');
  if (memModal) memModal.setAttribute('aria-hidden', 'true');

  const memContent = document.getElementById('memory-modal-content');
  if (memContent) {
    memContent.querySelectorAll('video').forEach(v => v.pause());
    memContent.innerHTML = '';
  }

  document.querySelectorAll('.chapter-overlay video').forEach(v => v.pause());
  unlockBodyScroll();

  setTimeout(() => {
    ['memory-overlay', 'memory-wrap', 'modal-overlay', 'secret-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.opacity = ''; el.style.pointerEvents = ''; }
    });
  }, 450);
}

document.querySelectorAll('.overlay-close')
  .forEach(btn => btn.addEventListener('click', closeAllOverlays));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllOverlays();
});

// clicking the overlay background (not the card) also closes
document.querySelectorAll('.chapter-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) closeAllOverlays(); });
});

// sealed envelope on the desk opens the letter overlay when clicked.
// guard against opening while it's mid-fade-in during the pull-back scrub.
if (folded) {
  folded.addEventListener('click', () => {
    if (parseFloat(getComputedStyle(folded).opacity) < 0.5) return;
    openOverlay('letter');
  });
}

// memory modal — click anywhere outside the modal card to close.
// map.js only wires this on memory-overlay (which sits behind memory-wrap and
// is therefore unreachable). We add it to memory-wrap directly.
const memWrap = document.getElementById('memory-wrap');
if (memWrap) {
  memWrap.addEventListener('click', (e) => {
    if (e.target !== memWrap) return;
    memWrap.classList.remove('open');
    document.getElementById('memory-overlay')?.classList.remove('open');
    document.getElementById('memory-modal')?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const memContent = document.getElementById('memory-modal-content');
    if (memContent) {
      memContent.querySelectorAll('video').forEach(v => v.pause());
      setTimeout(() => { memContent.innerHTML = ''; }, 350);
    }
  });
}
