---
title: Quiz Engine
description: Self-hosted kvízový engine. Hráči se připojí QR kódem a odpovídají přímo z mobilu.
tags: [Node.js, Express, Socket.IO, JavaScript, State Machine, ngrok]
repo: https://github.com/zlebuh/quiz-engine
screenshots:
  - assets/quiz-engine/03-host-question.png
  - assets/quiz-engine/01-host-lobby.png
  - assets/quiz-engine/02-mobile-join.jpg
  - assets/quiz-engine/04-mobile-timer.jpg
  - assets/quiz-engine/05-host-timer.png
  - assets/quiz-engine/06-mobile-submitted.jpg
  - assets/quiz-engine/07-host-standings.png
  - assets/quiz-engine/08-mobile-final.jpg
---

## Technický popis

Jednoduchý backend je napsaný v **JavaScriptu** a běží na **Express** frameworku **Node.js**. Pro real-time komunikaci mezi backendem a frontendovými klienty je použita knihovna **Socket.IO**. Stav hry je uložen v jednom in-memory objektu na serveru. Hra běží jako **stavový automat**. Kromě lokální sítě lze server zpřístupnit i mimo ni přes tunel [**ngrok**](https://ngrok.com/).

## Více informací

### Motivace

Očekával jsem u sebe doma partu kamarádů. Zrovna probíhalo Mistrovství světa ve fotbale a my jsme měli společně sledovat zápas. Napadlo mě, že připravím krátký tématický kvíz. Udělal jsem si rešerši dostupných kvízových webových aplikací. Moje požadavky byly:

- hráči se připojí naskenováním QR kódu, bez instalace čehokoliv
- kvíz se hraje přímo v mobilním prohlížeči
- možnost vlastní stylizace (název, barvy, vzhled)

Z cenově dostupných aplikací jsem žádnou nevybral, a tak jsem se rozhodl, že si zkusím **rychle** naprogramovat vlastní řešení.

### Spolehlivost

Největší výzvou bylo udržet hru konzistentní i při výpadcích. Mobilní připojení nemusí být vždy ideální, telefony se uzamykají, lidé přepínají aplikace. Díky **session ID** v **localStorage** se hráč do hry může kdykoli vrátit a klidně i v novém tabu.

### Modularita

Otázky a odpovědi se definují v jednoduchém **Markdown** souboru, který server při spuštění parsuje a rozdělí do sekcí. Odpovědi se vyhodnocují automaticky (normalizace textu, tolerance na shodu klíčového slova), moderátor ale může výsledek kdykoliv v review obrazovce manuálně přepsat.

Vizuální styl (název, podtitulek, barvy) je oddělený do konfiguračního **JSON** souboru, takže kvíz lze pro různé příležitosti rychle upravit bez zásahu do kódu. Pokročilý uživatel si může definovat **CSS** soubor s vlastním stylem.
