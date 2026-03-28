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
