---
title: Groše
description: Rodinná rozpočtová aplikace, která si bankovní platby stahuje a třídí sama, přímo z e-mailu.
tags: [Supabase, PostgreSQL, React, TypeScript, Edge Functions, Row Level Security]
screenshots:
  - assets/grose/01-transactions.png
  - assets/grose/03-accounts.png
  - assets/grose/04-budgets.png
  - assets/grose/05-budget-detail.png
  - assets/grose/02-transaction-detail.png
  - assets/grose/06-dark-mode.png
---

## Technický popis

Backend běží kompletně na **Supabase**: Postgres s **Row Level Security**, PostgREST pro CRUD operace a jedna Edge Function, která zpracovává příchozí bankovní e-maily. Klíčová logika (třídění transakcí, přepočty zůstatků, rozpočty) žije přímo v databázi jako triggery a funkce, ne v aplikačním kódu. Frontend je **React** + **TypeScript** (Vite, TanStack Query), mobile-first.

## Více informací

### Moje role

Vlastní nápad i kompletní realizace pro mou rodinu: datový model, bezpečnost, parsování bankovních e-mailů, celé UI i nasazení.

### Co aplikace umí

Groše si sama stahuje bankovní e-maily a nově příchozí platby automaticky roztřídí do kategorií podle dřívějších rozhodnutí. Hlídá rozpočty podle kategorií, upozorní na převody mezi vlastními účty a na jednom místě ukáže zůstatky a historii všech účtů.

### Kvalita a nasazení

Projekt má přes 90% pokrytí testy (jednotkové, databázové i end-to-end v Playwrightu), včetně testů proti souběžným zápisům do databáze. Nasazení na produkci běží automaticky přes GitHub Actions po každé změně na hlavní větvi, vždy až po úspěšném proběhnutí celé testovací sady.
