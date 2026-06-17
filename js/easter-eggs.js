/* Easter egg #1 - the hidden star opens the apology video.
   (Easter egg #2 lives in countdown.js, #3 in petals.js.) */

window.showNoSecret = function (e) {
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
  });
  document.body.appendChild(toast);
  gsap.fromTo(toast,
    { opacity: 0, y: 0 },
    { opacity: 1, y: -18, duration: 0.4, ease: 'power2.out',
      onComplete() {
        gsap.to(toast, { opacity: 0, y: -34, delay: 1.4, duration: 0.5, ease: 'power2.in',
          onComplete() { toast.remove(); }
        });
      }
    }
  );
};

(function () {
  const star = document.getElementById('secret-star');
  if (!star) return;
  // the hidden star is one of the secret triggers → opens the games page
  star.addEventListener('click', () => { window.location.href = 'games.html'; });
})();
