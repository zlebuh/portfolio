var translations = {
  cs: {
    // Nav
    "nav.projects": "Projekty",
    "nav.experience": "Zkušenosti",
    "nav.about": "O mně",
    "nav.contact": "Kontakt",

    // Footer
    "footer.copy": "\u00a9 2026 Petr Žlebek. Vytvořeno s péčí.",
    "footer.resume": "Životopis",

    // Hero
    "hero.available": "Dostupný pro nové příležitosti",
    "hero.desc": "Backend vývojář tvořící škálovatelné systémy a čistá API. Komplexní problémy měním na elegantní, produkčně připravená řešení.",
    "hero.viewProjects": "Zobrazit projekty",
    "hero.getInTouch": "Kontaktujte mě",
    "hero.cardRole": "Backend vývojář",
    "hero.yearsLabel": "Let zkušeností",
    "hero.projectsLabel": "Dodaných projektů",

    // Projects
    "projects.label": "// Vybraná práce",
    "projects.title": "Projekty",
    "projects.allLink": "Všechny projekty",
    "projects.featuredType": "Hlavní",
    "projects.featuredTitle": "Distribuovaný systém front úloh",
    "projects.featuredDesc": "Vysoce výkonná, odolná fronta úloh postavená na Go a Redis. Zpracuje 50 000+ úloh/s s garancí at-least-once doručení, distribuovanými worker pooly a real-time dashboardy.",
    "projects.apiType": "API",
    "projects.authTitle": "Auth mikroslužba",
    "projects.authDesc": "JWT autentizační služba bez závislostí s OAuth2, rotací refresh tokenů a rate limitingem. Používaná v produkci 3 produkty.",
    "projects.infraType": "Infrastruktura",
    "projects.dbTitle": "CLI pro migrace databáze",
    "projects.dbDesc": "Vývojářsky přívětivý nástroj pro migrace schématu s dry-run režimem, podporou rollbacku a CI/CD integrací.",

    // Experience
    "exp.label": "// Kariéra",
    "exp.title": "Zkušenosti",
    "exp.acme.present": "2022 \u2014 dosud",
    "exp.acme.role": "Senior backend inženýr",
    "exp.acme.desc": "Vedl re-architekturu platební platformy, snížení p99 latence o 60 %. Navrhl a postavil interní datový pipeline zpracovávající 2M+ událostí/den. Mentoroval 3 juniorní vývojáře.",
    "exp.startup.role": "Backend vývojář",
    "exp.startup.desc": "Vytvářel REST a GraphQL API obsluhující 100k+ denních aktivních uživatelů. Zodpovědný za notifikační systém a integrace s externími poskytovateli. Zvýšil pokrytí testy ze 40 % na 85 %.",
    "exp.freelance.company": "Na volné noze",
    "exp.freelance.role": "Backend vývojář",
    "exp.freelance.desc": "Dodal API integrace a backendové systémy pro 8 klientů z oblastí e-commerce, SaaS a fintech.",

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
    "about.title": "Nejen kód",
    "about.intro": "Žiji s manželkou, dcerou a naším psem v malém městě v Česku. Máme dům se zahradou, která mě drží při zemi — někdy doslova, když je potřeba posekat trávník.",
    "about.hobbies": "Sport byl vždycky velkou součástí mého života a jsem zarytý fanoušek Liverpool FC — YNWA, bez výjimek. Když zrovna nesleduji zápas nebo nesportuji, najdete mě u dobré knížky nebo jak ladím chytrou domácnost. Ukazuje se, že inženýra můžete vytáhnout z kódu, ale nezabráníte mu optimalizovat osvětlení v obýváku.",

    // Contact
    "contact.label": "// Pojďme si promluvit",
    "contact.heading": "Máte projekt<br>na <em>mysli?</em>",
    "contact.sub": "Otevřený novým rolím, freelance práci a zajímavým vedlejším projektům. Odpovídám do 24 hodin.",
    "contact.formName": "Jméno",
    "contact.formEmail": "E-mail",
    "contact.formMessage": "Zpráva",
    "contact.namePlaceholder": "Vaše jméno",
    "contact.emailPlaceholder": "vas@email.cz",
    "contact.messagePlaceholder": "Řekněte mi o vašem projektu\u2026",
    "contact.send": "Odeslat zprávu"
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
