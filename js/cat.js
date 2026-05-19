/* Pankina - Ana's cat, wandering across the bottom of the page.
   States: walking, sitting, sleeping (click to make her nap).         */

(function () {
  const cat = document.createElement('div');
  cat.id = 'pankina';
  cat.className = 'pankina pankina--walking';
  cat.innerHTML = `
    <div class="pankina-zs" aria-hidden="true">
      <span>z</span><span>z</span><span>z</span>
    </div>
    <svg class="pankina-sleep-sprite" viewBox="0 0 64 44" aria-label="Pankina the cat sleeping">
      <!-- tail tip curled around the front-left - black -->
      <path d="M 8 36 Q -2 28 6 22 Q 14 18 22 22"
            stroke="#2a2222" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <!-- body loaf -->
      <ellipse cx="28" cy="33" rx="22" ry="8.5" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.7"/>
      <!-- beige back patch on body -->
      <path d="M 10 27.5 Q 28 22 46 27.5 Q 38 30 28 30.5 Q 18 30.5 10 27.5 Z"
            fill="#c9a574" opacity="0.9"/>
      <!-- paw hint at the front -->
      <ellipse cx="42" cy="40" rx="3.4" ry="1.6" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.5"/>
      <!-- HEAD: a proper round head on the body's right shoulder -->
      <circle cx="45" cy="20" r="9" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.7"/>
      <!-- beige patch on top of head -->
      <path d="M 37.5 17 Q 45 11.5 52.5 17 Q 50.5 20.5 45 21 Q 39.5 20.5 37.5 17 Z"
            fill="#c9a574" opacity="0.9"/>
      <!-- ears - black triangles on top of head -->
      <path d="M 38 14 L 40 5 L 45 13 Z" fill="#2a2222" stroke-linejoin="round"/>
      <path d="M 46 13 L 50 5 L 53 14 Z" fill="#2a2222" stroke-linejoin="round"/>
      <!-- two closed eyes (curves) -->
      <path d="M 40.5 22 Q 42 23.5 43.5 22" stroke="#3a2b2b" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M 46.5 22 Q 48 23.5 49.5 22" stroke="#3a2b2b" stroke-width="1" fill="none" stroke-linecap="round"/>
      <!-- tiny nose -->
      <path d="M 44.4 25.3 L 45.6 25.3 L 45 26.2 Z" fill="#d49a9b"/>
      <!-- whisker hint - subtle line each side of nose -->
      <line x1="40.5" y1="25.5" x2="44" y2="25.7" stroke="#8a7060" stroke-width="0.25" opacity="0.6"/>
      <line x1="46" y1="25.7" x2="49.5" y2="25.5" stroke="#8a7060" stroke-width="0.25" opacity="0.6"/>
    </svg>
    <svg class="pankina-sprite" viewBox="0 0 64 44" aria-label="Pankina the cat">
      <!-- tail (animated in CSS) - black -->
      <path class="pk-tail" d="M6 30 Q -2 26 0 14" stroke="#2a2222" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <!-- body - white with soft outline -->
      <path class="pk-body" d="M6 30 Q 6 16 22 16 L 42 16 Q 52 16 52 26 L 52 34 L 6 34 Z"
            fill="#fbf2dd" stroke="#8a7060" stroke-width="0.6" stroke-linejoin="round"/>
      <!-- beige patch along the back -->
      <path d="M 18 16.4 Q 30 14.2 44 16.4 Q 40 21 30 22 Q 22 21.5 18 19 Z"
            fill="#c9a574" opacity="0.9"/>
      <!-- back legs - white -->
      <rect class="pk-leg pk-leg--back-1" x="10" y="32" width="3.2" height="9" rx="1.2" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.5"/>
      <rect class="pk-leg pk-leg--back-2" x="16" y="32" width="3.2" height="9" rx="1.2" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.5"/>
      <!-- front legs - white -->
      <rect class="pk-leg pk-leg--front-1" x="38" y="32" width="3.2" height="9" rx="1.2" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.5"/>
      <rect class="pk-leg pk-leg--front-2" x="44" y="32" width="3.2" height="9" rx="1.2" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.5"/>
      <!-- head - white -->
      <circle class="pk-head" cx="48" cy="20" r="8" fill="#fbf2dd" stroke="#8a7060" stroke-width="0.6"/>
      <!-- beige patch on top of head -->
      <path d="M 41.5 16 Q 48 11.5 54.5 16 Q 53 19.5 48 19.8 Q 43 19.5 41.5 16 Z"
            fill="#c9a574" opacity="0.9"/>
      <!-- ears - black -->
      <path class="pk-ear" d="M42 14 L 43.5 8 L 47 14 Z" fill="#2a2222"/>
      <path class="pk-ear" d="M49 13 L 51.5 8 L 53.5 14 Z" fill="#2a2222"/>
      <!-- eye (closes when sleeping) - dark for contrast against white -->
      <circle class="pk-eye" cx="50" cy="19.8" r="1.2" fill="#3a2b2b"/>
      <path class="pk-eye-closed" d="M48.5 19.8 Q 50 21.3 51.5 19.8" stroke="#3a2b2b" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      <!-- nose -->
      <circle cx="54.5" cy="21" r="0.7" fill="#d49a9b"/>
    </svg>
  `;
  document.body.appendChild(cat);

  // ─── state machine ─────────────────────────────────────────
  let state = 'walking';      // walking | sitting | sleeping
  let direction = 1;          // 1 right, -1 left
  let x = -80;
  let speed = 0.42;           // px / frame, slow stroll
  let nextIdleAt = performance.now() + 12000 + Math.random() * 8000;

  function setState(next) {
    if (state === next) return;
    cat.classList.remove(`pankina--${state}`);
    cat.classList.add(`pankina--${next}`);
    state = next;
  }

  function update() {
    if (state === 'walking') {
      x += direction * speed;
      // turn around past either edge
      if (direction > 0 && x > window.innerWidth + 40) {
        direction = -1;
      } else if (direction < 0 && x < -100) {
        direction = 1;
      }
      cat.style.transform = `translateX(${x}px) scaleX(${direction})`;

      // random sitting break
      if (performance.now() > nextIdleAt) {
        setState('sitting');
        // longer sits for the contemplative effect
        setTimeout(() => {
          if (state === 'sitting') setState('walking');
          nextIdleAt = performance.now() + 15000 + Math.random() * 12000;
        }, 4500 + Math.random() * 4000);
      }
    }
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  // ─── click to nap ──────────────────────────────────────────
  cat.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'sleeping') return;
    setState('sleeping');
    setTimeout(() => {
      // wake up — stretch (sit) briefly, then walk
      setState('sitting');
      setTimeout(() => setState('walking'), 1500);
      nextIdleAt = performance.now() + 20000 + Math.random() * 10000;
    }, 9000);
  });
})();
