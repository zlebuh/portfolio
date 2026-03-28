/* Theme: apply saved preference immediately to avoid flash */
(function () {
  var saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

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

/* Theme toggle */
(function () {
  var toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
})();
