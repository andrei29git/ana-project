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

// ───── arriving back from a feature page (#desk) ─────
// land directly on the fully-revealed desk instead of the top hero/clock.
if (window.location.hash === '#desk') {
  const jumpToDesk = () => {
    ScrollTrigger.refresh();
    const st = tl.scrollTrigger;
    if (st) window.scrollTo({ top: st.end, behavior: 'auto' });
  };
  if (document.readyState === 'complete') {
    jumpToDesk();
  } else {
    window.addEventListener('load', jumpToDesk);
  }
}

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
  item.addEventListener('click', () => {
    // items without a data-chapter (e.g. the calendar) handle their own
    // click behavior in their own script instead of navigating away.
    if (item.dataset.chapter) window.location.href = `${item.dataset.chapter}.html`;
  });
});

// ───── navigation ─────
// Each desk item now navigates to its own page (handled in the click
// handler above). The sealed envelope opens the letter page.
// guard against navigating while it's mid-fade-in during the pull-back scrub.
if (folded) {
  folded.addEventListener('click', () => {
    if (parseFloat(getComputedStyle(folded).opacity) < 0.5) return;
    window.location.href = 'letter.html';
  });
}
