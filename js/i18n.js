var translations = {
  cs: {
    // Nav
    "nav.projects": "Projekty",
    "nav.experience": "Životopis",
    "nav.about": "O mně",

    // Footer
    "footer.copy": "\u00a9 2026 Petr Žlebek. Vytvořeno s péčí.",


    // Hero
    "hero.available": "K dispozici pro freelance projekty",
    "hero.desc": "Jako softwarový inženýr dodávám <strong class=\"hl\">kompletní řešení</strong> — od prvního prototypu přes MVP až po produkci. Pomůžu Vašemu startupu rychle posouvat věci vpřed.",
    "hero.viewProjects": "Zobrazit projekty",
    "hero.cardRole": "Softwarový inženýr",
    "hero.orNote": "Specializuji se na <strong class=\"hl\">optimalizaci, matematické modelování a efektivní plánování</strong>. Pomůžu Vám nahradit plánování excelem nebo tužkou a papírem — díky softwaru, který šetří čas i náklady.",
    "hero.aiNote": "Mám více než <strong class=\"hl\">5 let praxe</strong> s vývojem softwaru — v malém startupovém týmu, v korporátu i v akademickém prostředí.",
    "hero.vibeNote": "<strong class=\"hl\">Nejsem 'vibecoder'.</strong> AI používám, abych zvýšil svou produktivitu — ne abych nechal celou aplikaci naslepo vygenerovat.",
    "hero.cta": "Můžu Vám s něčím pomoci? Ozvěte se.",
    "hero.copied": "Zkopírováno!",
    "hero.yearsLabel": "Let zkušeností",
    "hero.degreeLabel": "Aplikovaná informatika",


    // Projects
    "projects.label": "// Ukázky mé práce. U některých projektů je možné nahlédnout i do zdrojového kódu.",
    "projects.title": "Projekty",
    "projects.placeholder": "Zatím tu nic není. Pracuji na přidání...",

    // Experience
    "exp.label": "// Chronologicky uspořádané pracovní a studijní zkušenosti včetně popisu toho, co jsem tam dělal a co jsem se naučil.",
    "exp.title": "Životopis",
    "exp.freelance.present": "2025 \u2014 dosud",
    "exp.freelance.company": "Na volné noze",
    "exp.freelance.role": "Realizace vlastních projektů",
    "exp.freelance.desc": "Kompletní vývoj produkčního softwaru pro vlastní nápady. Mimo kódování také provoz projektů, sběr zpětné vazby od uživatelů a rozhodování o dalším směřování a produktizaci.",
    "exp.vut.present": "2025 \u2014 dosud",
    "exp.vut.company": "Ústav procesního inženýrství, FSI VUT",
    "exp.vut.role": "Vývoj optimalizačních algoritmů, Full Stack Developer",
    "exp.vut.desc": "Akademická půda. Podílení se na vývoji software pro optimalizaci plánování svozu odpadu.",
    "exp.thermofisher.present": "2023 \u2014 dosud",
    "exp.thermofisher.role": "Senior SW inženýr",
    "exp.thermofisher.desc": "Nadnárodní korporace. Vývoj interní aplikace pro konfiguraci digitálního dvojčete elektronového mikroskopu. Částečný ownership nad produktem. Mentoring juniorních vývojářů.",
    "exp.edhouse.present": "2025 \u2014 dosud",
    "exp.edhouse.role": "Vývojář matematických modelů a algoritmů",
    "exp.edhouse.desc": "Energetický startup. Vývoj matematického modelu a algoritmu pro optimální řízení nabíjení baterie a prodeje přetoků vzhledem k predikované spotřebě, výkonu fotovoltaické elektrárny a spotovým cenám.",
    "exp.solvertech.role": "Vývojář algoritmů, SW inženýr",
    "exp.solvertech.desc": "Malá rodinná firma. Vývoj algoritmů pro optimalizaci rozvozu. Udržování a rozvoj uživatelské aplikace pro plánování rozvozu. Komunikace se zákazníky a sběr požadavků pro další vývoj.",

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
    "edu.grammar.desc": "Na gymnáziu jsem vždy prospěl s vyznamenáním. Už zde začala má cesta díky volitelnému předmětu programování, ze kterého jsem nakonec i maturoval.",

    // About
    "about.label": "// Nejen prací je člověk živ.",
    "about.title": "O mně",
    "about.intro": "Žiji s manželkou, dcerou a naším psem na Valašsku. Máme dům se zahradou a s tím i nekonečný backlog, který mě chrání před ztrátou chuti k práci v kanceláři.",
    "about.hobbies": "Sport byl vždycky velkou součástí mého života a jsem zarytý fanoušek fotbalového Liverpoolu. Když zrovna nesleduji zápas nebo nesportuji, najdete mě u dobré knížky, s kytarou u táboráku nebo jak vylepšuji naši chytrou domácnost.",

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
