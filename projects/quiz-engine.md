---
title: Quiz Engine
description: Engine pro self-hosted kvíz. Hostitel řídí hru z jedné obrazovky (notebook/projektor), hráči se připojují přes QR kód a odpovídají ze svých mobilů.
tags: [Node.js, Express, Socket.IO, JavaScript]
repo: https://github.com/zlebuh/quiz-engine
screenshots:
  - assets/quiz-engine/01-host-lobby.png
  - assets/quiz-engine/02-mobile-join.jpg
  - assets/quiz-engine/03-host-question.png
  - assets/quiz-engine/04-mobile-timer.jpg
  - assets/quiz-engine/05-host-timer.png
  - assets/quiz-engine/06-mobile-submitted.jpg
  - assets/quiz-engine/07-host-standings.png
  - assets/quiz-engine/08-mobile-final.jpg
---

## Technický popis

Backend běží na Node.js, Express a Socket.IO. Veškerý stav hry žije v jediném in-memory objektu na serveru. *Tencí* klienti pouze zobrazují to, co jim server poslal. Hra běží jako stavový automat s fázemi: lobby → otázka → časovač → review → výsledky. Hráči se připojují skenováním QR kódu a při výpadku spojení se po návratu automaticky napojí zpět do aktuální fáze.

## Více informací

### Proč jsem se pustil do implementace

Očekával jsem u sebe doma partu kamarádů. Zrovna probíhalo Mistrovství světa ve fotbale a my jsme měli společně sledovat zápas. Napadlo mě, že připravím krátký kvíz. Udělal jsem si rešerši veřejných kvízových webových aplikací. Moje požadavky byly:

- hráči se připojí naskenováním QR kódu, bez instalace čehokoliv
- kvíz se hraje přímo v mobilním prohlížeči
- možnost vlastní stylizace (název, barvy, vzhled)

Z dostupných a levných aplikací jsem žádnou nevybral, a tak jsem se rozhodl, že si zkusím *rychle* naprogramovat vlastní řešení.

### Spolehlivost spojení

Největší výzvou bylo udržet hru konzistentní i při výpadcích – mobilní připojení na večírku není ideální, telefony se uzamykají, lidé přepínají aplikace. Hostitelský socket je jediný autorizovaný k řízení hry a server po každém reconnectu pošle hráči aktuální "snapshot" stavu hry (díky session ID v `localStorage`), takže hráč nikdy nezůstane zaseknutý na staré obrazovce.

### Otázky a vyhodnocování

Otázky a odpovědi se definují v jednoduchém Markdown souboru, který server parsuje do sekcí a otázek – kvíz si tak může kdokoliv připravit bez zásahu do kódu. Odpovědi se vyhodnocují automaticky (normalizace textu, tolerance na shodu klíčového slova), hostitel ale může výsledek kdykoliv v review obrazovce manuálně přepsat.

### Přepoužitelnost

Vizuální styl (název, podtitulek, barvy) je oddělený do konfiguračního JSON souboru, takže engine lze pro různé příležitosti rychle "přebarvit" bez zásahu do kódu. Jeden kvíz (na screenshotech "FIFA World Cup 2026") je jen jedna konkrétní konfigurace otázek a vzhledu – stejný kód lze znovu použít pro jakýkoliv jiný kvíz jen úpravou pár konfiguračních souborů.
