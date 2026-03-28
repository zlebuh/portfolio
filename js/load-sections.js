document.querySelectorAll('[data-section]').forEach(function (el) {
  var file = 'sections/' + el.getAttribute('data-section') + '.html';
  fetch(file)
    .then(function (res) {
      if (!res.ok) throw new Error(file + ' ' + res.status);
      return res.text();
    })
    .then(function (html) {
      el.innerHTML = html;
    });
});

/* Hamburger menu toggle */
(function () {
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');
  var nav = document.querySelector('nav');
  if (!hamburger) return;

  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    nav.classList.toggle('open');
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      nav.classList.remove('open');
    }
  });
})();
