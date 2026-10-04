---
title: Groše
description: Soukromá rodinná rozpočtová aplikace, která si bankovní výpisy stahuje sama z e-mailu, transakce automaticky třídí do kategorií a hlídá rozpočty i zůstatky účtů.
tags: [Supabase, PostgreSQL, pgTAP, React, TypeScript, Vite, Edge Functions, Row Level Security, Playwright, Cloudflare Workers]
screenshots:
  - assets/grose/01-transactions.png
  - assets/grose/03-accounts.png
  - assets/grose/04-budgets.png
  - assets/grose/05-budget-detail.png
  - assets/grose/02-transaction-detail.png
  - assets/grose/06-dark-mode.png
---

## Technický popis

Backend je kompletně na **Supabase**: Postgres s **Row Level Security**, PostgREST pro všechno CRUD a jedna Edge Function, která přijímá webhook s přeposlanou bankovní notifikací, bezpečně ověří jeho podpis a e-mail rozparsuje na transakci. Veškerá doménová logika — párování pohybů do transakcí, přepočty zůstatků, návrhy kategorií, sloučení a rozdělení transakcí, výpočet rozpočtů — běží přímo v databázi jako triggery, funkce a pohledy, ne v aplikačním kódu. Frontend je **React** + **TypeScript** (Vite, TanStack Query, react-i18next), mobile-first a napojený přes tenkou servisní vrstvu, díky které jde libovolná část UI otestovat proti falešné implementaci bez databáze.

## Více informací

### Moje role

Vlastní nápad i kompletní realizace pro mou rodinu — datový model, bezpečnost, parsování bankovních e-mailů, celé UI i nasazení.

### Synchronizace z e-mailu, ne z API banky

Česká banka rodiny nemá veřejné API pro retailové účty, takže Groše čte vlastní bankovní notifikační e-maily přeposlané přes Gmail filtr. Edge Function ověří podpis webhooku, e-mail stáhne a předá parseru, který z HTML vytáhne částku, měnu, protistranu i symboly platby — bez jediného regulárního výrazu s nelineární složitostí, aby ani uměle poškozený e-mail nemohl zaseknout zpracování. Výsledkem je jeden řádek v tabulce pohybů, idempotentně podle ID zprávy, takže opakované doručení stejného e-mailu nikdy nevytvoří duplicitní pohyb.

### Databáze jako zdroj pravdy

Skupina pohybů, která tvoří jednu transakci, její měna, datum i zůstatek se nepočítají v aplikaci, ale triggery přímo v Postgresu — stejně jako slučování a rozdělování transakcí, které běží jako atomické RPC funkce s vlastním zamykacím protokolem, aby souběžné úpravy nikdy nenechaly data v nekonzistentním stavu. Přes 50 pgTAP testů pokrývá databázová pravidla včetně souběžnosti (dvě reálná paralelní spojení záměrně vyvolávají deadlock a test ověří, že se obě strany bezpečně vzpamatují) a vlastní skript ověřuje, že pozdější migrace správně přepočítá i existující řádky.

### Návrhy kategorií a rozpoznávání převodů

Nad "známými" protiúčty a obchodníky běží enginu, který transakcím sám navrhuje kategorii a štítek podle dřívějších rozhodnutí uživatele — návrh ale nikdy nepřepíše to, co uživatel již jednou potvrdil. Převody mezi vlastními účty se nikdy neslučují automaticky; databáze jen nabídne pár kandidátů se shodnou částkou a časem a uživatel slučení potvrdí jedním tlačítkem.

### Rozpočty a test pokrytí

Rozpočet je definice s jednou částkou, která platí pro všechna kalendářní období zpětně i dopředu — žádná tabulka "rozpočet pro březen 2026" neexistuje, vše se počítá za běhu z transakcí. Projekt má přes 90% pokrytí testy u klíčové logiky (parser, ingestování, peněžní výpočty), end-to-end scénáře v Playwrightu pro mobilní i desktopové rozlišení a mutační testování kritických částí (peníze, bezpečnost, databázová pravidla).

### Nasazení

Databáze, Edge Function a frontend se nasazují automaticky při změně na hlavní větvi přes GitHub Actions: nejdřív běží celá testovací sada proti reálné lokální instanci Supabase, teprve pak jde nasazení na produkční Supabase projekt a frontend na Cloudflare Workers.
