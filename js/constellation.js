/* Constellation - the night sky over Bucharest on 12 July 2025.
   The brightest stars trace A-N-A. Click them in order to draw the
   constellation and reveal its name. */

(function () {
  const chart = document.getElementById('constellation-chart-svg');
  if (!chart) return;

  const starsBgGroup = document.getElementById('constellation-stars-bg');
  const linesGroup   = document.getElementById('constellation-lines');
  const starsGroup   = document.getElementById('constellation-stars');
  const hint         = document.getElementById('constellation-hint');
  const reveal       = document.getElementById('constellation-reveal');

  // ─── star positions (in viewBox coords, viewBox is 0 0 600 440) ───
  // Click order: A (3) → N (4) → A (3) = 10 stars
  const PUZZLE = [
    { x: 180, y: 310 },   // 0  A1 LL
    { x: 220, y: 130 },   // 1  A1 top
    { x: 260, y: 310 },   // 2  A1 LR
    { x: 275, y: 310 },   // 3  N  BL
    { x: 275, y: 130 },   // 4  N  TL
    { x: 345, y: 310 },   // 5  N  BR
    { x: 345, y: 130 },   // 6  N  TR
    { x: 360, y: 310 },   // 7  A2 LL
    { x: 400, y: 130 },   // 8  A2 top
    { x: 440, y: 310 },   // 9  A2 LR
  ];

  // ─── atmospheric background stars (don't collide with puzzle stars) ─
  const CHART_CX = 300, CHART_CY = 220, CHART_R = 195;

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function tooClose(pt) {
    for (const p of PUZZLE) if (distance(pt, p) < 18) return true;
    return false;
  }

  // seeded-ish reproducible feel - use the date as the seed
  function spawnBackgroundStars(n) {
    const stars = [];
    let attempts = 0;
    while (stars.length < n && attempts < n * 6) {
      attempts++;
      // random point inside the chart circle (rejection sampling)
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * (CHART_R - 8);
      const x = CHART_CX + Math.cos(angle) * r;
      const y = CHART_CY + Math.sin(angle) * r;
      if (tooClose({ x, y })) continue;
      stars.push({ x, y, size: 0.5 + Math.random() * 1.3, opacity: 0.35 + Math.random() * 0.45 });
    }
    return stars;
  }

  // place a few "named" labeled atmospheric stars for flavour
  const NAMED_STARS = [
    { x: 460, y: 200, name: 'Vega',   size: 2.2 },
    { x: 145, y: 215, name: 'Deneb',  size: 2.0 },
    { x: 320, y:  90, name: 'Altair', size: 1.9 },
  ];

  // ─── render ────────────────────────────────────────────────────────
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // background stars
  spawnBackgroundStars(54).forEach(s => {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', s.x);
    c.setAttribute('cy', s.y);
    c.setAttribute('r', s.size);
    c.setAttribute('class', 'c-bg-star');
    c.style.opacity = s.opacity;
    starsBgGroup.appendChild(c);
  });

  // named summer-triangle stars (slightly brighter, labeled)
  NAMED_STARS.forEach(s => {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', s.x);
    c.setAttribute('cy', s.y);
    c.setAttribute('r', s.size);
    c.setAttribute('class', 'c-named-star');
    starsBgGroup.appendChild(c);

    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', s.x + 6);
    t.setAttribute('y', s.y + 3);
    t.setAttribute('class', 'c-named-label');
    t.textContent = s.name;
    starsBgGroup.appendChild(t);
  });

  // puzzle stars
  const puzzleEls = PUZZLE.map((p, i) => {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'c-puzzle');
    g.setAttribute('transform', `translate(${p.x} ${p.y})`);
    g.dataset.idx = i;

    const halo = document.createElementNS(SVG_NS, 'circle');
    halo.setAttribute('r', 12);
    halo.setAttribute('class', 'c-puzzle-halo');
    g.appendChild(halo);

    const star = document.createElementNS(SVG_NS, 'circle');
    star.setAttribute('r', 2.6);
    star.setAttribute('class', 'c-puzzle-dot');
    g.appendChild(star);

    starsGroup.appendChild(g);
    return g;
  });

  // mark the next-to-click star as the "next"
  let currentIndex = 0;
  function markNext() {
    puzzleEls.forEach((el, i) => {
      el.classList.toggle('c-puzzle--next', i === currentIndex);
    });
  }
  markNext();

  // ─── click handling ────────────────────────────────────────────────
  function drawLine(from, to) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', PUZZLE[from].x);
    line.setAttribute('y1', PUZZLE[from].y);
    line.setAttribute('x2', PUZZLE[to].x);
    line.setAttribute('y2', PUZZLE[to].y);
    line.setAttribute('class', 'c-puzzle-line');
    linesGroup.appendChild(line);
  }

  // letter-boundaries: don't connect star 2→3 or 6→7 (between letters)
  const NO_LINE_AFTER = new Set([2, 6]);

  function activate(i, el) {
    el.classList.add('c-puzzle--lit');
    el.classList.remove('c-puzzle--next');
    if (i > 0 && !NO_LINE_AFTER.has(i - 1)) {
      drawLine(i - 1, i);
    }
    currentIndex = i + 1;
    if (currentIndex < PUZZLE.length) {
      markNext();
    } else {
      finish();
    }
  }

  function shake(el) {
    el.classList.add('c-puzzle--wrong');
    setTimeout(() => el.classList.remove('c-puzzle--wrong'), 450);
  }

  function finish() {
    chart.classList.add('constellation-chart--solved');
    setTimeout(() => {
      reveal.classList.add('constellation-reveal--visible');
      if (hint) hint.classList.add('constellation-hint--hidden');
    }, 350);
  }

  puzzleEls.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (el.classList.contains('c-puzzle--lit')) return;
      if (i === currentIndex) {
        activate(i, el);
      } else {
        shake(el);
      }
    });
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.dispatchEvent(new Event('click'));
      }
    });
  });

  // ─── hint reveal after a moment of idleness ───────────────────────
  setTimeout(() => {
    if (currentIndex === 0 && hint) hint.classList.add('constellation-hint--show');
  }, 4500);
})();
