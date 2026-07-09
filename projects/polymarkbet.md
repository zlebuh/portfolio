---
title: MidLine
description: Interní nástroj, který hledá výhodné rozdíly mezi kurzy sázkových kanceláří a predikčních trhů.
tags: [.NET, C#, React, TypeScript, PostgreSQL, Docker, Algorithmic Trading, Cloudflare Workers]
screenshots:
  - assets/polymarkbet/01-dashboard.png
  - assets/polymarkbet/02-fixtures.png
  - assets/polymarkbet/03-events.png
  - assets/polymarkbet/04-game.png
  - assets/polymarkbet/05-simulation-dark-mode.png
---

## Technický popis

Backend v **.NET 10** se skládá z API a knihoven, které zajišťují napojení na externí API, párování událostí, spouštění backtestingových simulací a persistenci dat. Administrační frontend je **React** + **TypeScript** aplikace, doplněná o malou **Node.js** službu, která streamuje průběh běžících background jobů do UI přes **WebSocket**.

## Více informací

### Moje role

Se startupem MidLine v pre-seed fázi spolupracuji jako freelancer. Mám plnou odpovědnost za architekturu, vývoj, nasazení i údržbu nástroje.

### Párování událostí

Největší výzvou a zároveň jednou z nejdůležitějších součástí projektu je automatické párování sázkových příležitostí mezi různými zdroji. Využívá se tokenizace názvů a Jaro-Winkler podobnost slov, doplněné o ručně spravované aliasy. Nutná je jen minimální manuální kontrola.

### Backtesting nad historickými daty

Simulační engine na základě předem nastavené strategie prochází všechny události z historického datasetu. V každém relevantním okamžiku zkontroluje, zda je dle strategie vhodné uskutečnit nákup dané pozice. Výsledkem simulace jsou jasně definované metriky, které stakeholderům umožní najít ideální strategii. Tyto výsledky také pomohou v rozhodování, zda má smysl do projektu a nástrojů dále investovat.

### Nasazení a zabezpečení

Docker Compose spouští backendové služby (API, migrační služba, realtime relay a Postgres). Každá služba má svůj healthcheck a případně závislost na pořadí startu. Backendové služby jsou nasazeny na VPS přes službu Coolify. Frontend admin je nasazen samostatně na Cloudflare Workers. Backend i frontend je nasazen automaticky v reakci na každou změnu v hlavní větvi repozitáře projektu prostřednictvím Github Actions. Frontend je díky Cloudflare Zero Trust přístupný pouze pro whitelistované uživatele. Endpointy backendové API jsou rovněž zabezpečené a dosažitelné pouze z chráněného frontendu.
