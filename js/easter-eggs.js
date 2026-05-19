/* Easter egg #1 - the hidden star opens the apology video.
   (Easter egg #2 lives in countdown.js, #3 in petals.js.) */

(function () {
  document.getElementById('secret-star').addEventListener('click', (e) => {
    if (window.openApology) window.openApology(e);
  });
})();
