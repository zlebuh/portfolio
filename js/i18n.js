var translations = {
  cs: {
    // Nav
    "nav.projects": "Projekty",
    "nav.experience": "Zkušenosti",
    "nav.about": "O mně",

    // Footer
    "footer.copy": "\u00a9 2026 Petr Žlebek. Vytvořeno s péčí.",


    // Hero
    "hero.desc": "Softwarový inženýr, který staví produkty od začátku do konce. Od prvního prototypu po produkci — backend, frontend, mobilní aplikace, nasazení. Pomáhám startupům rychle posouvat věci vpřed a dodávat MVP, která fungují.",
    "hero.viewProjects": "Zobrazit projekty",
    "hero.cardRole": "Softwarový inženýr",
    "hero.aiNote": "Nejsem vibecoder. Mám 5+ let praxe ve vývoji. AI používám, abych extrémně zvýšil svou efektivitu — ne abych nechal celou aplikaci naslepo vygenerovat.",
    "hero.cta": "Máte nápad na startup nebo potřebujete postavit MVP? Pojďme si promluvit.",
    "hero.copied": "Zkopírováno!",
    "hero.yearsLabel": "Let zkušeností",


    // Projects
    "projects.label": "// Vybraná práce",
    "projects.title": "Projekty",
    "projects.placeholder": "Referenční projekty již brzy. Zůstaňte naladěni.",

    // Experience
    "exp.label": "// Kariéra",
    "exp.title": "Zkušenosti",
    "exp.thermofisher.present": "2023 \u2014 dosud",
    "exp.thermofisher.role": "Senior SW inženýr",
    "exp.thermofisher.desc": "Vývoj interní aplikace pro konfiguraci digitálního dvojčete elektronového mikroskopu. Mám částečný ownership nad produktem a zároveň mentoruji juniorní vývojáře.",
    "exp.edhouse.present": "2023 \u2014 dosud",
    "exp.edhouse.role": "Vývojář algoritmů, Backend vývojář",
    "exp.edhouse.desc": "Pro energetický startup jsem vyvíjel algoritmus pro optimální řízení nabíjení baterie a prodeje přetoků vzhledem k predikované spotřebě, výkonu fotovoltaické elektrárny a spotovým cenám.",
    "exp.solvertech.role": "Vývojář algoritmů, Backend vývojář",
    "exp.solvertech.desc": "Vývoj optimalizačních algoritmů pro úlohu Vehicle Routing Problem.",

    // Education
    "edu.label": "// Vzdělání",
    "edu.title": "Vzdělání",
    "edu.master.school": "Vysoké učení technické Brno, Fakulta strojního inženýrství",
    "edu.master.degree": "Inženýrský titul v oboru Aplikovaná informatika a řízení",
    "edu.master.desc": "Téma diplomové práce: Hra Sokoban a umělá inteligence. Implementace algoritmů umělé inteligence pro řešení hlavolamové hry Sokoban ('skladník' posouvající bedýnky).",
    "edu.bachelor.school": "Vysoké učení technické Brno, Fakulta strojního inženýrství",
    "edu.bachelor.degree": "Bakalářský titul v oboru Matematické inženýrství",
    "edu.bachelor.desc": "Téma bakalářské práce: Dopravní modely a jejich aplikace. Implementace algoritmů operačního výzkumu při hledání optimálního rozložení zařízení na zpracování odpadu v rámci svozové sítě.",
    "edu.grammar.school": "Gymnázium Františka Palackého Valašské Meziříčí",
    "edu.grammar.field": "Všeobecné studium",
    "edu.grammar.desc": "Na gymnáziu jsem vždy prospěl s vyznamenáním. Už zde začala má cesta coby programátora díky volitelnému předmětu programování, ze kterého jsem nakonec i maturoval.",

    // About
    "about.label": "// Osobní",
    "about.title": "Nejen práce",
    "about.intro": "Žiji s manželkou, dcerou a naším psem na Valašsku. Máme dům se zahradou a s tím i nekonečný backlog, který mě chrání před ztrátou chuti k práci v kanceláři.",
    "about.hobbies": "Sport byl vždycky velkou součástí mého života a jsem zarytý fanoušek fotbalového Liverpoolu — YNWA. Když zrovna nesleduji zápas nebo nesportuji, najdete mě u dobré knížky, s kytarou u táboráku nebo jak vylepšuji naši chytrou domácnost.",

  }
};

function applyTranslations(lang) {
  // Handle textContent translations
  var els = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');

    // Save original English text on first run
    if (!el.hasAttribute('data-i18n-default')) {
      el.setAttribute('data-i18n-default', el.textContent);
    }

    if (lang === 'cs' && translations.cs[key]) {
      el.textContent = translations.cs[key];
    } else {
      el.textContent = el.getAttribute('data-i18n-default');
    }
  }

  // Handle innerHTML translations (for elements with HTML like <em>, <br>)
  var htmlEls = document.querySelectorAll('[data-i18n-html]');
  for (var j = 0; j < htmlEls.length; j++) {
    var htmlEl = htmlEls[j];
    var htmlKey = htmlEl.getAttribute('data-i18n-html');

    if (!htmlEl.hasAttribute('data-i18n-default')) {
      htmlEl.setAttribute('data-i18n-default', htmlEl.innerHTML);
    }

    if (lang === 'cs' && translations.cs[htmlKey]) {
      htmlEl.innerHTML = translations.cs[htmlKey];
    } else {
      htmlEl.innerHTML = htmlEl.getAttribute('data-i18n-default');
    }
  }

  // Handle placeholder translations
  var placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
  for (var k = 0; k < placeholderEls.length; k++) {
    var pEl = placeholderEls[k];
    var pKey = pEl.getAttribute('data-i18n-placeholder');

    if (!pEl.hasAttribute('data-i18n-placeholder-default')) {
      pEl.setAttribute('data-i18n-placeholder-default', pEl.getAttribute('placeholder') || '');
    }

    if (lang === 'cs' && translations.cs[pKey]) {
      pEl.setAttribute('placeholder', translations.cs[pKey]);
    } else {
      pEl.setAttribute('placeholder', pEl.getAttribute('data-i18n-placeholder-default'));
    }
  }

  // Update the toggle button label (show the OTHER language)
  var langLabel = document.querySelector('[data-lang-label]');
  if (langLabel) {
    langLabel.textContent = lang === 'cs' ? 'EN' : 'CZ';
  }
}
