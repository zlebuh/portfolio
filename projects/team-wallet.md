---
title: Team Wallet
description: Sdílená peněženka pro malý klub, napojená na bankovní účet.
tags: [Supabase, PostgreSQL, React, TypeScript, Edge Functions, Row Level Security]
screenshots:
  - assets/team-wallet/02-members.png
  - assets/team-wallet/01-bank-feed.png
  - assets/team-wallet/03-billing.png
  - assets/team-wallet/04-member-dashboard.png
  - assets/team-wallet/05-member-events.png
---

## Technický popis

Backend stojí kompletně na **Supabase**: Postgres s **Row Level Security**, PostgREST pro CRUD operace a tři Edge Functions pro zbytek (zvaní členů, synchronizace plateb z banky, e-mailová upozornění). Frontend je **React** + **TypeScript** (Vite, Tailwind, TanStack Query), napojený přímo na PostgREST bez vlastního API serveru.

## Více informací

### Role a zabezpečení

Dvě role, administrátor a člen. Zůstatky členů jsou i pro administrátora jen ke čtení, vynucené omezením na úrovni sloupců v databázi (RLS samo o sobě sloupce omezit neumí). Bez přihlášeného účtu s odpovídajícím záznamem člena je systém nedosažitelný.

### Napojení na bankovní účet

Edge Function pravidelně stahuje výpis z API banky FIO a podle variabilního symbolu platby automaticky páruje s členy, včetně potvrzovacího e-mailu. Stránka Bankovní výpis navíc porovnává skutečný zůstatek na účtu se součtem kreditů všech členů, takže je vidět, kolik peněz klub reálně vlastní nad rámec vkladů.

### Hromadné vyúčtování aktivit

Administrátor může průvodcem naúčtovat aktivitu (trénink, turnaj, soustředění) všem zúčastněným najednou. Cena se podle tarifu předvyplní automaticky, ale u každého člena ji lze ručně upravit.
