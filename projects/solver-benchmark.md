---
title: Solver Benchmark
description: Obecný dashboard pro spouštění, ukládání a porovnávání různých optimalizačních solverů.
tags: [.NET, C#, PostgreSQL, Docker, React, Vite, Tailwind CSS, WebSocket]
app: https://solverbenchmark-demo.petrzlebek.cz/
screenshots:
  - assets/solver-benchmark/02-solution.png
  - assets/solver-benchmark/01-instance.png
  - assets/solver-benchmark/03-solving.png
  - assets/solver-benchmark/04-dark-mode.png
---

## Technický popis

Backend je kompletně v .NET 10. Jako databázový systém se používají relační tabulky v PostgreSQL. Frontend je v Reactu. Fronta jobů využívá notifikační systém v PostgreSQL na backendu a WebSocket protokol na straně frontendu.

## Více informací

### Obecnost

Všechny optimalizační problémy a velké kombinatorické úlohy mají jedno společné. Mají jasně definované datové typy pro vstup a výstup. Přesně s tímto počítá tato webová aplikace, takže ji lze snadno přepoužít pro libovolný problém. Umožňuje spouštět různé solvery na různé instance a ukládat a porovnávat vypočtená řešení. Veřejně dostupné demo obsahuje ukázky Vehicle Routing Problem a jejich řešení.

Aplikace alespoň částečně podporuje všechny optimalizační úlohy. Všechny jsou ve výchozím stavu podporovány k prohlížení a editaci v raw json formátu. I to může mít svou přidanou hodnotu. K tomu, aby byla zajištěna plná podpora, je potřeba naimplementovat jednotlivé views pro datový typ instance problému, řešení problému a možnosti řešitele. Pokud tyto views implementují obecný interface a splňují naming konvence, zobrazí se místo raw jsonu právě implementovaná editovací okna.

### Napojení na solvery

Každá úloha má svůj specifický solver, který musí být zabalený v API. Ta musí implementovat specifikované API endpointy a běžet na předdomluveném portu tak, aby se na ni GUI mohlo napojit.