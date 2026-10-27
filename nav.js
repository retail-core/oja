// Shared by index.html, privacy.html and terms.html.
// Nav: darken the bar over light sections, and run the mobile menu.
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var toggle = nav.querySelector('.nav__toggle');

  function updateTheme() {
    var bar = nav.querySelector('.nav__bar').getBoundingClientRect();
    var probeY = bar.top + bar.height / 2;
    var hits = document.elementsFromPoint(window.innerWidth / 2, probeY);
    for (var i = 0; i < hits.length; i++) {
      if (nav.contains(hits[i])) continue;
      var themed = hits[i].closest('[data-nav-theme]');
      if (themed) {
        nav.classList.toggle('nav--on-light', themed.getAttribute('data-nav-theme') === 'light');
        return;
      }
    }
  }

  function setOpen(open) {
    nav.classList.toggle('nav--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('nav--open')); });
  nav.querySelectorAll('.nav__panel a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) { setOpen(false); toggle.focus(); }
  });

  // No fill while the page is at the very top; fill appears as soon as it scrolls
  function updateTop() {
    nav.classList.toggle('nav--at-top', window.scrollY <= 0);
  }

  window.addEventListener('scroll', function () { updateTop(); updateTheme(); }, { passive: true });
  window.addEventListener('resize', updateTheme);
  updateTop();
  updateTheme();

  // Arriving from another page with a #section link (e.g. privacy.html -> index.html#faq):
  // re-align once images and fonts have loaded, in case they pushed the section down.
  window.addEventListener('load', function () {
    var target = location.hash && document.getElementById(location.hash.slice(1));
    if (target && Math.abs(target.getBoundingClientRect().top) > 2) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
})();
