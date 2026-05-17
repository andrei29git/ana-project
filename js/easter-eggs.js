/* Easter egg #1 - the hidden star - plus modal open/close handling.
   (Easter egg #2 lives in countdown.js, #3 in petals.js.) */

(function () {
  const overlay  = document.getElementById('modal-overlay');
  const modal    = document.getElementById('secret-modal');
  const closeBtn = document.getElementById('modal-close');

  function open()  { overlay.classList.add('open');    modal.classList.add('open'); }
  function close() { overlay.classList.remove('open'); modal.classList.remove('open'); }

  document.getElementById('secret-star').addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
