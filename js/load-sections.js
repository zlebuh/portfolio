/* Theme: apply saved preference immediately to avoid flash */
(function () {
  var saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

/* Language: detect and set lang attribute immediately */
var currentLang = (function () {
  var saved = localStorage.getItem('lang');
  if (saved) return saved;
  var nav = (navigator.language || '').toLowerCase();
  return (nav.indexOf('cs') === 0 || nav.indexOf('sk') === 0) ? 'cs' : 'en';
})();
document.documentElement.lang = currentLang;

/* Set initial toggle label and translate nav/footer immediately */
(function () {
  var label = document.querySelector('[data-lang-label]');
  if (label) label.textContent = currentLang === 'cs' ? 'EN' : 'CZ';
  applyTranslations(currentLang);
})();

/* Load sections with Promise.all, then apply translations */
var sections = document.querySelectorAll('[data-section]');
var promises = [];
for (var i = 0; i < sections.length; i++) {
  (function (el) {
    var file = 'sections/' + el.getAttribute('data-section') + '.html';
    promises.push(
      fetch(file)
        .then(function (res) {
          if (!res.ok) throw new Error(file + ' ' + res.status);
          return res.text();
        })
        .then(function (html) {
          el.innerHTML = html;
        })
    );
  })(sections[i]);
}

Promise.all(promises).then(function () {
  applyTranslations(currentLang);
  initContactForm();
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

/* Language toggle */
(function () {
  var toggle = document.querySelector('.lang-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    currentLang = currentLang === 'en' ? 'cs' : 'en';
    localStorage.setItem('lang', currentLang);
    document.documentElement.lang = currentLang;
    applyTranslations(currentLang);
  });
})();

/* Contact form — JS fetch submission */
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = form.querySelector('.form-status');
  var btnLabel = form.querySelector('[data-i18n="contact.send"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('.btn-send');
    btn.disabled = true;
    var origText = btnLabel.textContent;
    btnLabel.textContent = currentLang === 'cs' ? 'Odesílám\u2026' : 'Sending\u2026';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    var data = {
      access_key: '87d64630-11b8-4915-8b49-17683c281164',
      subject: 'New contact from petrzlebek.cz',
      from_name: 'petrzlebek.cz',
      name: form.elements.name.value,
      email: form.elements.email.value,
      message: form.elements.message.value
    };

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function (res) { return res.json(); })
    .then(function (result) {
      if (result.success) {
        statusEl.textContent = currentLang === 'cs'
          ? 'Zpráva odeslána! Ozvu se co nejdříve.'
          : 'Message sent! I\u2019ll get back to you soon.';
        statusEl.className = 'form-status form-status-success';
        form.reset();
      } else {
        throw new Error(result.message || 'Error');
      }
    })
    .catch(function () {
      statusEl.textContent = currentLang === 'cs'
        ? 'Něco se pokazilo. Zkuste to znovu nebo napište přímo na email.'
        : 'Something went wrong. Try again or email me directly.';
      statusEl.className = 'form-status form-status-error';
    })
    .finally(function () {
      btn.disabled = false;
      btnLabel.textContent = origText;
    });
  });
}
