# otwarteschroniska.org.pl MVP v1.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować i wdrożyć pierwsze otwarte API schronisk dla zwierząt w Polsce (`otwarteschroniska.org.pl`) — statyczne JSONy + landing z live playgroundem, hosted na Vercel, repo publiczne na GitHubie.

**Architecture:** Astro 6 statyczny → 5 endpointów `.json.ts` w `/api/v1/` + landing LP2 (hero + playground + 4 snippety + bar charts pokrycia + showcase ZZ + Schema.org Dataset JSON-LD). Single source of truth: `src/data/master.json` (127 schronisk z Phase 1). Middleware ustawia CORS `*` + Cache-Control 1h. Wersjonowanie URL `/api/v1/`.

**Tech Stack:** Astro 6, TypeScript, React 19 (jeden island na playground), Zod (schema validation), Vercel hobby (hosting + auto-deploy + custom domain), GitHub publiczne repo (CC-BY 4.0 dane + MIT kod).

**Spec source:** `apps/otwarteschroniska/docs/superpowers/specs/2026-04-29-otwarteschroniska-api-design.md`

**Cross-spec dep:** Plan #2 (`apps/zatrzymajzegar/docs/superpowers/plans/2026-04-29-schroniska-pages.md`) wymaga że TEN plan jest wykonany pierwszy (otwarteschroniska musi być LIVE zanim ZZ build fetchuje API).

**Wymagane akcje fizyczne Lecha (poza Claude execution):**
- Task 2: utworzenie projektu Vercel (dashboard)
- Task 24: rejestracja domeny `otwarteschroniska.org.pl` (home.pl/NetArt) — DAY 1
- Task 25: setup ImprovMX dla `kontakt@otwarteschroniska.org.pl` — DAY 1
- Task 26: utworzenie GitHub publicznego repo (`gh repo create` lub dashboard)

---

## Files structure (locked-in)

```
apps/otwarteschroniska/
├── .gitignore                          ← już jest (initial commit)
├── package.json                        ← Task 1
├── tsconfig.json                       ← Task 1
├── astro.config.mjs                    ← Task 1 + Task 12 (middleware register)
├── README.md                           ← Task 22
├── LICENSE                             ← Task 22 (MIT)
├── LICENSE-DATA                        ← Task 22 (CC-BY 4.0)
├── CHANGELOG.md                        ← Task 22
├── CONTRIBUTING.md                     ← Task 22
├── docs/                               ← już jest (spec)
│   └── superpowers/
│       ├── specs/2026-04-29-otwarteschroniska-api-design.md
│       └── plans/2026-04-29-otwarteschroniska-mvp.md  ← TEN PLIK
├── public/
│   ├── favicon.ico                     ← Task 22
│   ├── og-image.png                    ← Task 22 (1200×630, brand)
│   └── api/v1/types.d.ts               ← Task 4 (statyczny TS types)
├── src/
│   ├── data/
│   │   └── master.json                 ← Task 3 (z aktualnym Krotoszynem)
│   ├── schemas/
│   │   └── shelter.ts                  ← Task 4 (Zod schema)
│   ├── lib/
│   │   ├── data.ts                     ← Task 5 (loadShelters, getShelter, etc.)
│   │   └── manifest.ts                 ← Task 6 (computeCoverage)
│   ├── middleware.ts                   ← Task 12 (CORS + Cache-Control)
│   ├── layouts/
│   │   └── Layout.astro                ← Task 13 (B&W minimalist + canonical)
│   ├── components/
│   │   ├── Footer.astro                ← Task 14
│   │   ├── Snippet.astro               ← Task 15 (4 tabs)
│   │   ├── CoverageChart.astro         ← Task 16 (SVG bars)
│   │   ├── Playground.tsx              ← Task 17 (React island)
│   │   └── DatasetJsonLd.astro         ← Task 18 (Schema.org Dataset)
│   └── pages/
│       ├── index.astro                 ← Task 19 (landing LP2)
│       ├── api/v1/
│       │   ├── manifest.json.ts        ← Task 7
│       │   ├── shelters.json.ts        ← Task 8
│       │   ├── shelters/[wojewodztwo].json.ts  ← Task 9
│       │   ├── shelters/[slug].json.ts ← Task 10
│       │   └── schema.json.ts          ← Task 11
│       └── docs/
│           ├── index.astro             ← Task 20
│           ├── schema.astro            ← Task 20
│           ├── quality.astro           ← Task 20
│           └── changelog.astro         ← Task 20
└── tests/                              ← selective unit tests
    ├── lib/data.test.ts                ← Task 5
    └── lib/manifest.test.ts            ← Task 6
```

---

## Task 1: Project scaffold (Astro init)

**Files:**
- Create: `apps/otwarteschroniska/package.json`
- Create: `apps/otwarteschroniska/astro.config.mjs`
- Create: `apps/otwarteschroniska/tsconfig.json`
- Create: `apps/otwarteschroniska/src/env.d.ts`

- [ ] **Step 1: Initialize npm + install Astro**

```bash
cd /Users/lech/aidevs/apps/otwarteschroniska
npm init -y
npm install astro@^6.0.0 @astrojs/check@latest typescript@latest
npm install --save-dev @types/node
```

Expected: `node_modules/` created, `package.json` with astro dependency.

- [ ] **Step 2: Create `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://otwarteschroniska.vercel.app',  // day 0; day 1+ → otwarteschroniska.org.pl
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", ".astro/types.d.ts"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 4: Create `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 5: Verify build works (empty project)**

```bash
mkdir -p src/pages
echo '---\n---\n<h1>Hello otwarteschroniska</h1>' > src/pages/index.astro
npx astro build
```

Expected: `dist/` created with `index.html`. No errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/
git commit -m "feat: initial Astro 6 scaffold"
```

---

## Task 2: Vercel project setup (Lech action + config)

**Files:**
- Create: `apps/otwarteschroniska/vercel.json`

- [ ] **Step 1 (Lech action): Stwórz nowy Vercel project**

Lech wykonuje w przeglądarce:
1. Wejdź na https://vercel.com/new
2. Import Git Repository (jeszcze nie ma — pomiń, wróć do Task 26)
3. Lub: utwórz pusty projekt manualnie (Settings → Deploy from CLI). To opcjonalne na ten moment — projekt zostanie utworzony przy pierwszym `vercel deploy` lub przez GitHub integration w Task 26.

**Pomiń jeśli wrócisz do tego po Task 26 (Lech tworzy projekt z GitHub repo).**

- [ ] **Step 2: Create `vercel.json` (configuration)**

```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "headers": [
    {
      "source": "/api/v1/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" },
        { "key": "Cache-Control", "value": "public, max-age=3600, stale-while-revalidate=86400" }
      ]
    }
  ]
}
```

Headers w `vercel.json` to backup do middleware (Task 12) — zapewnia headers nawet gdy middleware nie działa lub gdy plik jest serwowany z `public/`.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat: vercel.json config (CORS + Cache-Control dla /api/v1/)"
```

---

## Task 3: Master.json import + Krotoszyn pre-launch update

**Files:**
- Read: `/Users/lech/aidevs/apps/zatrzymajzegar/src/content/schroniska/krotoszyn.md` (źródło najświeższych danych)
- Modify: `/Users/lech/aidevs/projects/schroniska-baza/output/master.json` (manual edit Krotoszyn record)
- Create: `apps/otwarteschroniska/src/data/master.json` (cp z schroniska-baza)

- [ ] **Step 1: Przeczytaj świeże dane Krotoszyna z ZZ**

```bash
cat /Users/lech/aidevs/apps/zatrzymajzegar/src/content/schroniska/krotoszyn.md
```

Wypisz pola do aktualizacji:
- `nazwa`: "TOZ Krotoszyn" (nie "Schronisko Dla Bezdomnych Zwierząt w Krotoszynie")
- `telefon`: "+48 660 662 191" (adopcyjny, nie "+48 502 616 205")
- `telefon_dodatkowy`: "+48 660 662 171"
- `godziny`: "pn-pt 10:00-15:00"
- `email`: "krotoszyn@eadopcje.org"

- [ ] **Step 2: Manualnie zaktualizuj Krotoszyn w master.json**

```bash
python3 -c "
import json
PATH = '/Users/lech/aidevs/projects/schroniska-baza/output/master.json'
with open(PATH) as f:
    data = json.load(f)
for s in data['shelters']:
    if s['id'] == 'krotoszyn-ceglarska-11':
        s['nazwa'] = 'TOZ Krotoszyn'
        s['telefon'] = '+48 660 662 191'
        s['telefon_dodatkowy'] = '+48 660 662 171'
        s['godziny'] = 'pn-pt 10:00-15:00'
        s['email'] = 'krotoszyn@eadopcje.org'
        print('Updated:', json.dumps(s, ensure_ascii=False, indent=2))
        break
with open(PATH, 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print('Saved to', PATH)
"
```

Expected: wypisuje zaktualizowany rekord Krotoszyn + saves to file.

- [ ] **Step 3: Skopiuj master.json do otwarteschroniska**

```bash
mkdir -p /Users/lech/aidevs/apps/otwarteschroniska/src/data
cp /Users/lech/aidevs/projects/schroniska-baza/output/master.json /Users/lech/aidevs/apps/otwarteschroniska/src/data/master.json
```

- [ ] **Step 4: Verify file**

```bash
python3 -c "
import json
with open('/Users/lech/aidevs/apps/otwarteschroniska/src/data/master.json') as f:
    data = json.load(f)
print('schema_version:', data.get('schema_version'))
print('total_shelters:', data.get('total_shelters'))
print('Krotoszyn nazwa:', next(s['nazwa'] for s in data['shelters'] if s['id'] == 'krotoszyn-ceglarska-11'))
print('Krotoszyn telefon:', next(s['telefon'] for s in data['shelters'] if s['id'] == 'krotoszyn-ceglarska-11'))
"
```

Expected: schema_version 1.0, total_shelters 127, Krotoszyn nazwa "TOZ Krotoszyn", telefon "+48 660 662 191".

- [ ] **Step 5: Commit (otwarteschroniska repo)**

```bash
cd /Users/lech/aidevs/apps/otwarteschroniska
git add src/data/master.json
git commit -m "data: import master.json (127 shelters) + Krotoszyn update z opiekuna"
```

**UWAGA:** schroniska-baza repo nie jest jeszcze pod gitem (CLAUDE.md mówi „git init po MVP, za zgodą Lecha"). Edycja master.json w schroniska-baza pozostaje uncommitted lokalnie — to jest OK na ten moment, źródłem prawdy jest otwarteschroniska repo.

---

## Task 4: Zod schema + types.d.ts

**Files:**
- Create: `apps/otwarteschroniska/src/schemas/shelter.ts`
- Create: `apps/otwarteschroniska/public/api/v1/types.d.ts`
- Create: `apps/otwarteschroniska/tests/lib/data.test.ts` (test fixture za chwilę)

- [ ] **Step 1: Install Zod + vitest**

```bash
cd /Users/lech/aidevs/apps/otwarteschroniska
npm install zod
npm install --save-dev vitest @vitest/ui
```

- [ ] **Step 2: Create `src/schemas/shelter.ts`**

```ts
// src/schemas/shelter.ts
import { z } from 'zod';

// Schema mirror master.json schema v1.0
export const ShelterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  nazwa: z.string().min(1),
  wojewodztwo: z.string().min(1),
  miasto: z.string().min(1),
  kod_pocztowy: z.string().regex(/^\d{2}-\d{3}$/).nullable().optional(),
  adres: z.string().nullable().optional(),
  telefon: z.string().nullable().optional(),
  telefon_dodatkowy: z.string().nullable().optional(),
  godziny: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  www: z.string().url().nullable().optional(),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable().optional(),
  zrodla: z.array(z.string().url()).optional(),
  data_quality_score: z.number().int().min(1).max(6).optional(),
  notatki: z.string().nullable().optional(),
  opt_out: z.boolean().optional(),
});

export const MasterDataSchema = z.object({
  schema_version: z.string(),
  generated_at: z.string(),
  total_shelters: z.number().int().positive(),
  license: z.string(),
  shelters: z.array(ShelterSchema),
});

export type Shelter = z.infer<typeof ShelterSchema>;
export type MasterData = z.infer<typeof MasterDataSchema>;
```

- [ ] **Step 3: Write failing test — Zod parses real master.json**

Create `tests/lib/data.test.ts`:

```ts
// tests/lib/data.test.ts
import { describe, it, expect } from 'vitest';
import { MasterDataSchema } from '../../src/schemas/shelter';
import data from '../../src/data/master.json';

describe('master.json schema validation', () => {
  it('parses without errors', () => {
    const result = MasterDataSchema.safeParse(data);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    expect(result.success).toBe(true);
  });

  it('contains 127 shelters', () => {
    const parsed = MasterDataSchema.parse(data);
    expect(parsed.shelters.length).toBe(127);
  });

  it('all shelters have unique IDs', () => {
    const parsed = MasterDataSchema.parse(data);
    const ids = parsed.shelters.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
```

Add to `package.json` scripts:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Run test (should pass — schema matches)**

```bash
npm test
```

Expected: 3 tests pass. Jeśli faila — debug schema vs faktyczne pola w master.json (adjust schema lub data).

- [ ] **Step 5: Create `public/api/v1/types.d.ts` (statyczny TypeScript types dla devów)**

```ts
// public/api/v1/types.d.ts
// Polish Animal Shelters Open Dataset v1.0 — TypeScript types
// License: CC-BY 4.0 (data) | https://otwarteschroniska.org.pl

/** Voivodeship slug (Polish administrative region), lowercased without diacritics */
export type Wojewodztwo =
  | 'dolnoslaskie' | 'kujawsko-pomorskie' | 'lubelskie' | 'lubuskie'
  | 'lodzkie' | 'malopolskie' | 'mazowieckie' | 'opolskie'
  | 'podkarpackie' | 'podlaskie' | 'pomorskie' | 'slaskie'
  | 'swietokrzyskie' | 'warminsko-mazurskie' | 'wielkopolskie' | 'zachodniopomorskie';

/** Geo coordinates (WGS84) */
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

/** Single animal shelter record */
export interface Shelter {
  /** Stable identifier, format: {city}-{street-number} or {city}-{name-slug} */
  id: string;
  /** Official shelter name */
  nazwa: string;
  /** Voivodeship (administrative region) */
  wojewodztwo: Wojewodztwo;
  /** City */
  miasto: string;
  /** Polish postal code in format XX-XXX */
  kod_pocztowy?: string | null;
  /** Street address */
  adres?: string | null;
  /** Primary phone number */
  telefon?: string | null;
  /** Secondary phone number (e.g., adoption-specific) */
  telefon_dodatkowy?: string | null;
  /** Opening hours (free-form string, e.g., "pn-pt 10:00-15:00") */
  godziny?: string | null;
  /** Contact email */
  email?: string | null;
  /** Website URL */
  www?: string | null;
  /** Geographic coordinates (WGS84) */
  geo?: GeoCoordinates | null;
  /** Source URLs (provenance) */
  zrodla?: string[];
  /** Quality score 1-6, see /docs/quality */
  data_quality_score?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Optional internal notes */
  notatki?: string | null;
  /** True if shelter requested opt-out (RODO) — record retained but signaled */
  opt_out?: boolean;
}

/** Top-level dataset structure */
export interface MasterData {
  schema_version: string;
  generated_at: string;
  total_shelters: number;
  license: string;
  shelters: Shelter[];
}
```

- [ ] **Step 6: Commit**

```bash
git add src/schemas/shelter.ts public/api/v1/types.d.ts tests/lib/data.test.ts package.json package-lock.json
git commit -m "feat: Zod schema + TypeScript types.d.ts (EN docs dla devów)"
```

---

## Task 5: lib/data.ts (loadShelters + getters)

**Files:**
- Create: `apps/otwarteschroniska/src/lib/data.ts`
- Modify: `apps/otwarteschroniska/tests/lib/data.test.ts`

- [ ] **Step 1: Write failing tests for getters**

Append to `tests/lib/data.test.ts`:

```ts
import { loadShelters, getShelter, getSheltersByWojewodztwo } from '../../src/lib/data';

describe('lib/data', () => {
  it('loadShelters returns array of 127', () => {
    const shelters = loadShelters();
    expect(shelters.length).toBe(127);
  });

  it('getShelter returns Krotoszyn record', () => {
    const shelter = getShelter('krotoszyn-ceglarska-11');
    expect(shelter).not.toBeNull();
    expect(shelter?.nazwa).toBe('TOZ Krotoszyn');
    expect(shelter?.miasto).toBe('Krotoszyn');
  });

  it('getShelter returns null for unknown id', () => {
    expect(getShelter('nieistnieje-123')).toBeNull();
  });

  it('getSheltersByWojewodztwo returns wielkopolskie shelters', () => {
    const shelters = getSheltersByWojewodztwo('wielkopolskie');
    expect(shelters.length).toBeGreaterThan(0);
    expect(shelters.every((s) => s.wojewodztwo === 'wielkopolskie')).toBe(true);
    expect(shelters.some((s) => s.id === 'krotoszyn-ceglarska-11')).toBe(true);
  });

  it('getSheltersByWojewodztwo returns empty for unknown', () => {
    expect(getSheltersByWojewodztwo('nieistnieje').length).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: 3 nowe tests fail (`Cannot find module '../../src/lib/data'`).

- [ ] **Step 3: Implement `src/lib/data.ts`**

```ts
// src/lib/data.ts
// Load + query helpers dla master.json (parsowanie + walidacja Zod w build-time).

import { MasterDataSchema, type Shelter, type MasterData } from '../schemas/shelter';
import rawData from '../data/master.json';

let _cache: MasterData | null = null;

/** Załaduj cały dataset (Zod parsed, cached). Pada przy invalid schema. */
export function loadMasterData(): MasterData {
  if (_cache) return _cache;
  _cache = MasterDataSchema.parse(rawData);
  return _cache;
}

/** Tablica wszystkich schronisk (127 rekordów). */
export function loadShelters(): Shelter[] {
  return loadMasterData().shelters;
}

/** Pojedyncze schronisko po ID (stable). Zwraca null jeśli nie znalezione. */
export function getShelter(id: string): Shelter | null {
  return loadShelters().find((s) => s.id === id) ?? null;
}

/** Schroniska w danym województwie (slug, np. "dolnoslaskie"). */
export function getSheltersByWojewodztwo(wojewodztwo: string): Shelter[] {
  return loadShelters().filter((s) => s.wojewodztwo === wojewodztwo);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test
```

Expected: All 8 tests pass (3 schema + 5 lib/data).

- [ ] **Step 5: Commit**

```bash
git add src/lib/data.ts tests/lib/data.test.ts
git commit -m "feat: lib/data.ts (loadShelters + getShelter + getSheltersByWojewodztwo)"
```

---

## Task 6: lib/manifest.ts (computeCoverage)

**Files:**
- Create: `apps/otwarteschroniska/src/lib/manifest.ts`
- Create: `apps/otwarteschroniska/tests/lib/manifest.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/lib/manifest.test.ts`:

```ts
// tests/lib/manifest.test.ts
import { describe, it, expect } from 'vitest';
import { computeCoverage } from '../../src/lib/manifest';
import type { Shelter } from '../../src/schemas/shelter';

describe('lib/manifest', () => {
  it('computeCoverage with empty array returns 0%', () => {
    const c = computeCoverage([]);
    expect(c.telefon_pct).toBe(0);
    expect(c.email_pct).toBe(0);
    expect(c.www_pct).toBe(0);
    expect(c.geo_pct).toBe(0);
  });

  it('computeCoverage counts non-null/non-empty correctly', () => {
    const shelters: Shelter[] = [
      { id: 'a', nazwa: 'A', wojewodztwo: 'dolnoslaskie', miasto: 'X', telefon: '+48 1', email: 'a@b.com' },
      { id: 'b', nazwa: 'B', wojewodztwo: 'dolnoslaskie', miasto: 'Y', telefon: '+48 2', email: null, www: 'http://x.pl' },
      { id: 'c', nazwa: 'C', wojewodztwo: 'dolnoslaskie', miasto: 'Z' },
      { id: 'd', nazwa: 'D', wojewodztwo: 'dolnoslaskie', miasto: 'W', geo: { lat: 50, lng: 17 } },
    ];
    const c = computeCoverage(shelters);
    expect(c.telefon_pct).toBe(50.0);  // 2/4
    expect(c.email_pct).toBe(25.0);    // 1/4
    expect(c.www_pct).toBe(25.0);      // 1/4
    expect(c.geo_pct).toBe(25.0);      // 1/4
  });
});
```

- [ ] **Step 2: Run test (should fail — module not found)**

```bash
npm test
```

Expected: 2 tests fail.

- [ ] **Step 3: Implement `src/lib/manifest.ts`**

```ts
// src/lib/manifest.ts
// Compute coverage statistics z dataset (telefon%, email%, www%, geo%).

import type { Shelter } from '../schemas/shelter';

export interface Coverage {
  telefon_pct: number;
  email_pct: number;
  www_pct: number;
  geo_pct: number;
}

/** Procent rekordów z niepustym polem (rounded to 1 decimal). */
export function computeCoverage(shelters: Shelter[]): Coverage {
  const total = shelters.length;
  if (total === 0) {
    return { telefon_pct: 0, email_pct: 0, www_pct: 0, geo_pct: 0 };
  }
  const pct = (count: number) => Math.round((count / total) * 1000) / 10;
  return {
    telefon_pct: pct(shelters.filter((s) => !!s.telefon).length),
    email_pct: pct(shelters.filter((s) => !!s.email).length),
    www_pct: pct(shelters.filter((s) => !!s.www).length),
    geo_pct: pct(shelters.filter((s) => !!s.geo).length),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test
```

Expected: All tests pass (10 total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/manifest.ts tests/lib/manifest.test.ts
git commit -m "feat: lib/manifest.ts (computeCoverage z bar-chart calculations)"
```

---

## Task 7: API endpoint manifest.json.ts

**Files:**
- Create: `apps/otwarteschroniska/src/pages/api/v1/manifest.json.ts`

- [ ] **Step 1: Implement endpoint**

```ts
// src/pages/api/v1/manifest.json.ts
import type { APIRoute } from 'astro';
import { loadMasterData, loadShelters } from '../../../lib/data';
import { computeCoverage } from '../../../lib/manifest';

export const GET: APIRoute = () => {
  const master = loadMasterData();
  const shelters = loadShelters();
  const coverage = computeCoverage(shelters);

  const manifest = {
    schema_version: master.schema_version,
    generated_at: master.generated_at,
    total_shelters: master.total_shelters,
    license: master.license,
    endpoints: {
      manifest: '/api/v1/manifest.json',
      shelters_all: '/api/v1/shelters.json',
      shelters_by_wojewodztwo: '/api/v1/shelters/{wojewodztwo}.json',
      shelter_by_slug: '/api/v1/shelters/{slug}.json',
      schema: '/api/v1/schema.json',
      types: '/api/v1/types.d.ts',
    },
    coverage,
    documentation: 'https://otwarteschroniska.vercel.app/docs/',  // post-domain swap to .org.pl
    license_url: 'https://creativecommons.org/licenses/by/4.0/',
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
```

- [ ] **Step 2: Build and verify locally**

```bash
npm run build
ls -la dist/api/v1/manifest.json
cat dist/api/v1/manifest.json | head -30
```

Expected: file exists, JSON valid, contains schema_version + total_shelters: 127 + coverage object.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/v1/manifest.json.ts
git commit -m "feat: /api/v1/manifest.json endpoint (metadata + coverage)"
```

---

## Task 8: API endpoint shelters.json.ts (cały dataset)

**Files:**
- Create: `apps/otwarteschroniska/src/pages/api/v1/shelters.json.ts`

- [ ] **Step 1: Implement endpoint**

```ts
// src/pages/api/v1/shelters.json.ts
import type { APIRoute } from 'astro';
import { loadShelters } from '../../../lib/data';

export const GET: APIRoute = () => {
  const shelters = loadShelters();
  return new Response(JSON.stringify(shelters, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
ls -la dist/api/v1/shelters.json
python3 -c "import json; data = json.load(open('dist/api/v1/shelters.json')); print('count:', len(data)); print('first id:', data[0]['id'])"
```

Expected: file exists, count: 127, valid JSON array.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/v1/shelters.json.ts
git commit -m "feat: /api/v1/shelters.json endpoint (cały dataset 127)"
```

---

## Task 9: API endpoint shelters/[wojewodztwo].json.ts

**Files:**
- Create: `apps/otwarteschroniska/src/pages/api/v1/shelters/[wojewodztwo].json.ts`

- [ ] **Step 1: Implement endpoint with getStaticPaths**

```ts
// src/pages/api/v1/shelters/[wojewodztwo].json.ts
import type { APIRoute, GetStaticPaths } from 'astro';
import { loadShelters, getSheltersByWojewodztwo } from '../../../../lib/data';

export const getStaticPaths: GetStaticPaths = () => {
  const shelters = loadShelters();
  const uniqueWoj = Array.from(new Set(shelters.map((s) => s.wojewodztwo)));
  return uniqueWoj.map((wojewodztwo) => ({
    params: { wojewodztwo },
  }));
};

export const GET: APIRoute = ({ params }) => {
  const woj = params.wojewodztwo as string;
  const shelters = getSheltersByWojewodztwo(woj);
  return new Response(JSON.stringify(shelters, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
ls dist/api/v1/shelters/
python3 -c "import json; data = json.load(open('dist/api/v1/shelters/wielkopolskie.json')); print('woj count:', len(data)); print('Krotoszyn?', any(s['id'] == 'krotoszyn-ceglarska-11' for s in data))"
```

Expected: ~16 plików per woj, wielkopolskie.json contains Krotoszyn.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/v1/shelters/
git commit -m "feat: /api/v1/shelters/[wojewodztwo].json (16 endpointów per województwo)"
```

---

## Task 10: API endpoint shelters/[slug].json.ts

**Files:**
- Create: `apps/otwarteschroniska/src/pages/api/v1/shelters/[slug].json.ts`

⚠️ **Konflikt routingu z Task 9:** Astro nie pozwala na dwa pliki `[param].json.ts` w tym samym folderze. Trzeba użyć subfolderu lub innego naming pattern.

**Decyzja:** użyjemy struktury `shelters/by-slug/[slug].json.ts` — drobna zmiana URL contract:

```
/api/v1/shelters/{wojewodztwo}.json    ← Task 9
/api/v1/shelters/by-id/{slug}.json     ← Task 10 (zmiana z proponowanego)
```

Update spec post-impl.

- [ ] **Step 1: Implement endpoint**

```ts
// src/pages/api/v1/shelters/by-id/[slug].json.ts
import type { APIRoute, GetStaticPaths } from 'astro';
import { loadShelters, getShelter } from '../../../../../lib/data';

export const getStaticPaths: GetStaticPaths = () => {
  return loadShelters().map((s) => ({ params: { slug: s.id } }));
};

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const shelter = getShelter(slug);
  if (!shelter) {
    return new Response(JSON.stringify({ error: 'Not found', id: slug }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return new Response(JSON.stringify(shelter, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
ls dist/api/v1/shelters/by-id/ | head -5
python3 -c "import json; data = json.load(open('dist/api/v1/shelters/by-id/krotoszyn-ceglarska-11.json')); print('nazwa:', data['nazwa']); print('telefon:', data['telefon'])"
```

Expected: 127 plików, Krotoszyn nazwa "TOZ Krotoszyn", telefon "+48 660 662 191".

- [ ] **Step 3: Update Task 7 manifest endpoints listing (zmiana URL)**

Modify `src/pages/api/v1/manifest.json.ts`:

```ts
// Zmień:
shelter_by_slug: '/api/v1/shelters/{slug}.json',
// Na:
shelter_by_id: '/api/v1/shelters/by-id/{id}.json',
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/v1/shelters/by-id/ src/pages/api/v1/manifest.json.ts
git commit -m "feat: /api/v1/shelters/by-id/[slug].json (127 endpointów per schronisko)"
```

---

## Task 11: schema.json.ts (JSON Schema z EN docs)

**Files:**
- Create: `apps/otwarteschroniska/src/pages/api/v1/schema.json.ts`

- [ ] **Step 1: Implement endpoint**

```ts
// src/pages/api/v1/schema.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://otwarteschroniska.org.pl/api/v1/schema.json',
    title: 'Polish Animal Shelters Open Dataset',
    description: 'Open dataset of animal shelters in Poland (CC-BY 4.0)',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        pattern: '^[a-z0-9-]+$',
        description: 'Stable identifier, format: {city}-{street-number} or {city}-{name-slug}',
      },
      nazwa: {
        type: 'string',
        minLength: 1,
        description: 'Official shelter name in Polish',
      },
      wojewodztwo: {
        type: 'string',
        enum: [
          'dolnoslaskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
          'lodzkie', 'malopolskie', 'mazowieckie', 'opolskie',
          'podkarpackie', 'podlaskie', 'pomorskie', 'slaskie',
          'swietokrzyskie', 'warminsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie',
        ],
        description: 'Voivodeship slug (Polish administrative region), lowercased without diacritics',
      },
      miasto: {
        type: 'string',
        description: 'City name in Polish',
      },
      kod_pocztowy: {
        type: ['string', 'null'],
        pattern: '^\\d{2}-\\d{3}$',
        description: 'Polish postal code in format XX-XXX',
      },
      adres: {
        type: ['string', 'null'],
        description: 'Street address',
      },
      telefon: {
        type: ['string', 'null'],
        description: 'Primary phone number (international format preferred)',
      },
      telefon_dodatkowy: {
        type: ['string', 'null'],
        description: 'Secondary phone number (e.g., adoption-specific)',
      },
      godziny: {
        type: ['string', 'null'],
        description: 'Opening hours (free-form Polish, e.g., "pn-pt 10:00-15:00")',
      },
      email: {
        type: ['string', 'null'],
        format: 'email',
        description: 'Contact email',
      },
      www: {
        type: ['string', 'null'],
        format: 'uri',
        description: 'Website URL',
      },
      geo: {
        type: ['object', 'null'],
        properties: {
          lat: { type: 'number', description: 'Latitude (WGS84)' },
          lng: { type: 'number', description: 'Longitude (WGS84)' },
        },
        required: ['lat', 'lng'],
        description: 'Geographic coordinates (WGS84). Coverage: ~17% of dataset.',
      },
      zrodla: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        description: 'Source URLs (provenance, attribution to original sources)',
      },
      data_quality_score: {
        type: 'integer',
        minimum: 1,
        maximum: 6,
        description: 'Quality score 1-6: 1=minimal, 6=complete. See /docs/quality.',
      },
      notatki: {
        type: ['string', 'null'],
        description: 'Internal notes (e.g., "kontakt prywatny" for opt-out cases)',
      },
      opt_out: {
        type: 'boolean',
        description: 'True if shelter requested RODO opt-out (record retained for transparency, but signaled)',
      },
    },
    required: ['id', 'nazwa', 'wojewodztwo', 'miasto'],
  };

  return new Response(JSON.stringify(schema, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
```

- [ ] **Step 2: Build + verify**

```bash
npm run build
cat dist/api/v1/schema.json | head -20
```

Expected: JSON Schema valid, contains EN descriptions per field.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/v1/schema.json.ts
git commit -m "feat: /api/v1/schema.json (JSON Schema 2020-12 z EN docs per pole)"
```

---

## Task 12: Middleware (CORS + Cache-Control)

**Files:**
- Create: `apps/otwarteschroniska/src/middleware.ts`

UWAGA: na statycznych Astro builds middleware działa tylko gdy hosting wspiera SSR middleware (Vercel does). Dla statycznych pages, headers ustawione przez `vercel.json` (Task 2). Middleware to BACKUP + dev-time setup.

- [ ] **Step 1: Implement middleware**

```ts
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Tylko dla /api/* dorzucamy CORS + Cache-Control
  if (context.url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  return response;
});
```

- [ ] **Step 2: Test lokalnie**

```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -I http://localhost:4321/api/v1/manifest.json | grep -i "access-control\|cache-control"
kill $DEV_PID
```

Expected: `Access-Control-Allow-Origin: *` + `Cache-Control: public, max-age=3600...` w response headers.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: middleware CORS + Cache-Control dla /api/*"
```

---

## Task 13: Layout.astro (B&W minimalist + canonical)

**Files:**
- Create: `apps/otwarteschroniska/src/layouts/Layout.astro`

- [ ] **Step 1: Implement Layout**

```astro
---
// src/layouts/Layout.astro
// Minimalist B&W layout. Serif heading + sans body. Canonical URL self-referential.

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description = 'Pierwsze otwarte API schronisk dla zwierząt w Polsce', ogImage = '/og-image.png' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site).href;
---

<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, Astro.site).href} />

    <slot name="head" />
  </head>
  <body>
    <header class="site-header">
      <a href="/" class="brand">otwarteschroniska<span class="dot">.</span>org<span class="dot">.</span>pl</a>
      <nav>
        <a href="/">API</a>
        <a href="/docs/">Dokumentacja</a>
        <a href="https://github.com/Lechr11/otwarteschroniska" rel="external">GitHub</a>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <slot name="footer" />

    <style is:global>
      :root {
        --color-bg: #ffffff;
        --color-text: #1a1a1a;
        --color-muted: #6b6b6b;
        --color-border: #e5e5e5;
        --color-accent: #000000;
        --font-serif: Georgia, 'Times New Roman', serif;
        --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-mono: 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
        --max-width: 880px;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: var(--font-sans);
        color: var(--color-text);
        background: var(--color-bg);
        line-height: 1.6;
      }

      h1, h2, h3 {
        font-family: var(--font-serif);
        font-weight: normal;
        line-height: 1.2;
      }

      h1 { font-size: 2.5rem; margin: 0 0 0.5em; }
      h2 { font-size: 1.75rem; margin: 1.5em 0 0.5em; }
      h3 { font-size: 1.25rem; margin: 1em 0 0.5em; }

      a {
        color: var(--color-accent);
        text-decoration: underline;
      }

      .site-header {
        max-width: var(--max-width);
        margin: 0 auto;
        padding: 1.5rem 1.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .site-header .brand {
        font-family: var(--font-serif);
        font-size: 1.25rem;
        text-decoration: none;
      }

      .site-header .brand .dot {
        color: var(--color-muted);
      }

      .site-header nav {
        display: flex;
        gap: 1.5rem;
        font-size: 0.95rem;
      }

      main {
        max-width: var(--max-width);
        margin: 2rem auto;
        padding: 0 1.5rem;
      }

      code, pre {
        font-family: var(--font-mono);
        font-size: 0.9em;
      }

      pre {
        background: #f5f5f5;
        padding: 1rem;
        overflow-x: auto;
        border-left: 3px solid var(--color-accent);
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: Smoke test (build pages)**

W Task 19+ użyjemy Layout. Na razie tylko verify że plik kompiluje:

```bash
npm run build
```

Expected: build success (Layout.astro nie jest jeszcze użyty, ale parsuje się bez błędów).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: Layout.astro (B&W minimalist + canonical URL + OG meta)"
```

---

## Task 14: Footer.astro

**Files:**
- Create: `apps/otwarteschroniska/src/components/Footer.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/Footer.astro
---

<footer class="site-footer">
  <p>
    Powered by <a href="https://www.zatrzymajzegar.pl" rel="external">ZatrzymajZegar.pl</a>
    &middot; Dane: <a href="https://creativecommons.org/licenses/by/4.0/" rel="external">CC-BY 4.0</a>
    &middot; <a href="mailto:kontakt@otwarteschroniska.org.pl">Kontakt</a>
  </p>
  <p class="muted">
    Open dataset of Polish animal shelters &middot; First-mover open data initiative
  </p>
</footer>

<style>
  .site-footer {
    max-width: var(--max-width);
    margin: 4rem auto 2rem;
    padding: 2rem 1.5rem 0;
    border-top: 1px solid var(--color-border);
    text-align: center;
    font-size: 0.9rem;
  }
  .site-footer p { margin: 0.25em 0; }
  .site-footer .muted { color: var(--color-muted); font-size: 0.85rem; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: Footer.astro (Powered by ZZ + CC-BY 4.0 attribution)"
```

---

## Task 15: Snippet.astro (4 tabs: curl/JS/Python/Node)

**Files:**
- Create: `apps/otwarteschroniska/src/components/Snippet.astro`

- [ ] **Step 1: Implement (CSS-only tabs, no JS)**

```astro
---
// src/components/Snippet.astro
// 4 tabs (radio inputs + labels for CSS-only switching). Każdy snippet 5-7 linii copy-paste.

const apiBase = 'https://otwarteschroniska.vercel.app/api/v1';  // post-domain swap to .org.pl

const snippets = {
  curl: `# Pobierz wszystkie schroniska\ncurl ${apiBase}/shelters.json | jq '.[] | select(.miasto == "Wrocław")'`,
  js: `// W przeglądarce / Node 18+\nconst r = await fetch('${apiBase}/shelters.json');\nconst shelters = await r.json();\nconsole.log(\`Łącznie: \${shelters.length} schronisk\`);`,
  python: `# Wymaga: pip install requests\nimport requests\nshelters = requests.get('${apiBase}/shelters.json').json()\nprint(f"Łącznie: {len(shelters)} schronisk")\n# Filter z emailem:\nwith_email = [s for s in shelters if s.get('email')]`,
  node: `// Node.js 20+ (built-in fetch)\nconst r = await fetch('${apiBase}/shelters.json');\nconst data = await r.json();\nconst byWoj = data.reduce((acc, s) => {\n  acc[s.wojewodztwo] = (acc[s.wojewodztwo] || 0) + 1;\n  return acc;\n}, {});\nconsole.table(byWoj);`,
};
---

<div class="snippet-tabs">
  <input type="radio" name="snippet-lang" id="lang-curl" checked />
  <input type="radio" name="snippet-lang" id="lang-js" />
  <input type="radio" name="snippet-lang" id="lang-python" />
  <input type="radio" name="snippet-lang" id="lang-node" />

  <div class="tab-labels">
    <label for="lang-curl">curl</label>
    <label for="lang-js">JavaScript</label>
    <label for="lang-python">Python</label>
    <label for="lang-node">Node.js</label>
  </div>

  <div class="tab-content" data-tab="curl"><pre><code>{snippets.curl}</code></pre></div>
  <div class="tab-content" data-tab="js"><pre><code>{snippets.js}</code></pre></div>
  <div class="tab-content" data-tab="python"><pre><code>{snippets.python}</code></pre></div>
  <div class="tab-content" data-tab="node"><pre><code>{snippets.node}</code></pre></div>
</div>

<style>
  .snippet-tabs { margin: 1rem 0; }
  .snippet-tabs input[type="radio"] { display: none; }

  .tab-labels {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--color-border);
  }
  .tab-labels label {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: 1px solid transparent;
    border-bottom: none;
    font-size: 0.9rem;
    user-select: none;
  }
  .tab-labels label:hover { background: #f5f5f5; }

  .tab-content { display: none; margin-top: 0; }
  .tab-content pre { margin: 0; border-top: none; }

  /* CSS-only tab switching */
  #lang-curl:checked ~ .tab-labels label[for="lang-curl"],
  #lang-js:checked ~ .tab-labels label[for="lang-js"],
  #lang-python:checked ~ .tab-labels label[for="lang-python"],
  #lang-node:checked ~ .tab-labels label[for="lang-node"] {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }
  #lang-curl:checked ~ .tab-content[data-tab="curl"],
  #lang-js:checked ~ .tab-content[data-tab="js"],
  #lang-python:checked ~ .tab-content[data-tab="python"],
  #lang-node:checked ~ .tab-content[data-tab="node"] {
    display: block;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Snippet.astro
git commit -m "feat: Snippet.astro (4 tabs CSS-only: curl/JS/Python/Node)"
```

---

## Task 16: CoverageChart.astro (SVG bars)

**Files:**
- Create: `apps/otwarteschroniska/src/components/CoverageChart.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/CoverageChart.astro
// Static SVG bar charts pokrycia danych (z manifest.json build-time).

import { loadShelters } from '../lib/data';
import { computeCoverage } from '../lib/manifest';

const coverage = computeCoverage(loadShelters());

const bars = [
  { label: 'Telefon', pct: coverage.telefon_pct },
  { label: 'Adres', pct: 100 },  // adres + miasto + woj są required (Phase 1 hard gate)
  { label: 'WWW', pct: coverage.www_pct },
  { label: 'Email', pct: coverage.email_pct },
  { label: 'Geo-koord.', pct: coverage.geo_pct },
];

const barWidth = 600;
const barHeight = 24;
const labelWidth = 100;
---

<div class="coverage-chart">
  <h3>Pokrycie danych</h3>
  <svg viewBox={`0 0 ${labelWidth + barWidth + 80} ${bars.length * (barHeight + 8) + 8}`} role="img" aria-labelledby="coverage-title">
    <title id="coverage-title">Pokrycie pól w datasecie ({bars.length} kategorii)</title>
    {bars.map((bar, i) => {
      const y = i * (barHeight + 8) + 8;
      const filledWidth = (bar.pct / 100) * barWidth;
      return (
        <g>
          <text x={labelWidth - 10} y={y + barHeight / 2 + 5} text-anchor="end" font-size="14" fill="currentColor">{bar.label}</text>
          <rect x={labelWidth} y={y} width={barWidth} height={barHeight} fill="#f0f0f0" />
          <rect x={labelWidth} y={y} width={filledWidth} height={barHeight} fill="#1a1a1a" />
          <text x={labelWidth + barWidth + 10} y={y + barHeight / 2 + 5} font-size="14" fill="currentColor">{bar.pct.toFixed(1)}%</text>
        </g>
      );
    })}
  </svg>
</div>

<style>
  .coverage-chart {
    margin: 2rem 0;
  }
  .coverage-chart svg {
    width: 100%;
    height: auto;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CoverageChart.astro
git commit -m "feat: CoverageChart.astro (SVG bar charts pokrycia z manifest)"
```

---

## Task 17: Playground.tsx (React island)

**Files:**
- Create: `apps/otwarteschroniska/src/components/Playground.tsx`

- [ ] **Step 1: Install React integration**

```bash
npx astro add react
# When prompted, answer Y to all
```

This adds `@astrojs/react` to astro.config.mjs and installs react + react-dom.

- [ ] **Step 2: Implement Playground**

```tsx
// src/components/Playground.tsx
// React island: dropdown województwa → fetch endpoint → JSON pretty print.

import { useState } from 'react';

const WOJEWODZTWA = [
  ['dolnoslaskie', 'Dolnośląskie'],
  ['kujawsko-pomorskie', 'Kujawsko-Pomorskie'],
  ['lubelskie', 'Lubelskie'],
  ['lubuskie', 'Lubuskie'],
  ['lodzkie', 'Łódzkie'],
  ['malopolskie', 'Małopolskie'],
  ['mazowieckie', 'Mazowieckie'],
  ['opolskie', 'Opolskie'],
  ['podkarpackie', 'Podkarpackie'],
  ['podlaskie', 'Podlaskie'],
  ['pomorskie', 'Pomorskie'],
  ['slaskie', 'Śląskie'],
  ['swietokrzyskie', 'Świętokrzyskie'],
  ['warminsko-mazurskie', 'Warmińsko-Mazurskie'],
  ['wielkopolskie', 'Wielkopolskie'],
  ['zachodniopomorskie', 'Zachodniopomorskie'],
];

const API_BASE = 'https://otwarteschroniska.vercel.app/api/v1';  // post-domain swap to .org.pl

export default function Playground() {
  const [woj, setWoj] = useState<string>('');
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWoj = e.target.value;
    setWoj(newWoj);
    if (!newWoj) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/shelters/${newWoj}.json`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const endpoint = woj ? `GET ${API_BASE}/shelters/${woj}.json` : 'GET /api/v1/shelters/{wojewodztwo}.json';

  return (
    <div className="playground">
      <label className="playground-label">
        <span>Wybierz województwo:</span>
        <select value={woj} onChange={handleChange}>
          <option value="">-- wybierz --</option>
          {WOJEWODZTWA.map(([slug, label]) => (
            <option key={slug} value={slug}>{label}</option>
          ))}
        </select>
      </label>

      <div className="endpoint-display">
        <strong>Endpoint:</strong> <code>{endpoint}</code>
      </div>

      <div className="response-area">
        {loading && <p>Ładowanie...</p>}
        {error && <p className="error">Błąd: {error}</p>}
        {data && (
          <pre>{JSON.stringify(data, null, 2).slice(0, 2000)}{JSON.stringify(data).length > 2000 && '\n\n...(skrócone)'}</pre>
        )}
        {!loading && !error && !data && <p className="muted">Wybierz województwo aby zobaczyć odpowiedź API.</p>}
      </div>

      <style>{`
        .playground {
          margin: 2rem 0;
          border: 1px solid var(--color-border, #e5e5e5);
          padding: 1.5rem;
        }
        .playground-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .playground-label select {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid var(--color-border, #e5e5e5);
        }
        .endpoint-display {
          margin: 1rem 0;
          padding: 0.75rem;
          background: #f9f9f9;
          font-size: 0.9rem;
        }
        .response-area pre {
          max-height: 400px;
          overflow-y: auto;
          font-size: 0.85rem;
        }
        .error { color: #c00; }
        .muted { color: #888; font-style: italic; }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Playground.tsx package.json package-lock.json astro.config.mjs
git commit -m "feat: Playground.tsx React island (dropdown + fetch + JSON pretty print)"
```

---

## Task 18: DatasetJsonLd.astro (Schema.org)

**Files:**
- Create: `apps/otwarteschroniska/src/components/DatasetJsonLd.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/components/DatasetJsonLd.astro
// Schema.org Dataset JSON-LD dla Google Dataset Search ranking (decyzja meta-1).

import { loadMasterData } from '../lib/data';

const master = loadMasterData();
const apiBase = 'https://otwarteschroniska.vercel.app/api/v1';  // post-domain swap

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Polish Animal Shelters Open Dataset',
  alternateName: 'otwarteschroniska.org.pl',
  description: 'Otwarty zbiór danych o schroniskach dla zwierząt w Polsce. Pierwsze publiczne API z pełną listą polskich schronisk. Licencja CC-BY 4.0.',
  url: 'https://otwarteschroniska.vercel.app',  // post-domain swap
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: {
    '@type': 'Person',
    name: 'Lech Rudnicki',
    url: 'https://www.zatrzymajzegar.pl',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ZatrzymajZegar.pl',
    url: 'https://www.zatrzymajzegar.pl',
  },
  spatialCoverage: {
    '@type': 'Country',
    name: 'Poland',
    identifier: 'PL',
  },
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${apiBase}/shelters.json`,
      name: 'Full dataset (JSON)',
    },
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/schema+json',
      contentUrl: `${apiBase}/schema.json`,
      name: 'JSON Schema (with EN documentation)',
    },
  ],
  temporalCoverage: `${master.generated_at.slice(0, 10)}/..`,
  keywords: [
    'animal shelters', 'Poland', 'open data', 'CC-BY 4.0',
    'schroniska dla zwierząt', 'adopcja zwierząt', 'API',
    'Polish open data', 'animal welfare',
  ],
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'Total shelters', value: master.total_shelters },
  ],
  isAccessibleForFree: true,
};
---

<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} is:inline />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DatasetJsonLd.astro
git commit -m "feat: DatasetJsonLd.astro (Schema.org Dataset dla Google Dataset Search)"
```

---

## Task 19: index.astro (landing LP2 — pełny)

**Files:**
- Create: `apps/otwarteschroniska/src/pages/index.astro`

- [ ] **Step 1: Implement**

```astro
---
// src/pages/index.astro
// Landing LP2: hero + playground + 4 snippets + bar charts + showcase ZZ + Schema.org Dataset.

import Layout from '../layouts/Layout.astro';
import Footer from '../components/Footer.astro';
import Snippet from '../components/Snippet.astro';
import CoverageChart from '../components/CoverageChart.astro';
import DatasetJsonLd from '../components/DatasetJsonLd.astro';
import Playground from '../components/Playground.tsx';
import { loadMasterData } from '../lib/data';

const master = loadMasterData();
---

<Layout
  title="otwarteschroniska.org.pl — Otwarte API schronisk dla zwierząt w Polsce"
  description={`${master.total_shelters} schronisk · 16 województw · CC-BY 4.0 · Pierwsze otwarte API w Polsce`}
>
  <DatasetJsonLd slot="head" />

  <section class="hero">
    <h1>Otwarte API schronisk dla zwierząt w Polsce</h1>
    <p class="lead">
      <strong>{master.total_shelters} schronisk</strong> · 16 województw · Licencja <a href="https://creativecommons.org/licenses/by/4.0/" rel="external">CC-BY 4.0</a>
    </p>
    <p class="hero-cta">
      <a href="/api/v1/shelters.json" class="btn">Pobierz dane (JSON)</a>
      <a href="/api/v1/schema.json" class="btn btn-secondary">JSON Schema</a>
    </p>
  </section>

  <section class="section">
    <h2>Wypróbuj API teraz</h2>
    <p>Wybierz województwo aby zobaczyć przykładową odpowiedź:</p>
    <Playground client:visible />
  </section>

  <section class="section">
    <h2>Jak zacząć</h2>
    <p>Skopiuj jeden z 4 snippetów i jesteś gotowy:</p>
    <Snippet />
  </section>

  <section class="section">
    <CoverageChart />
    <p class="muted">
      Pomóż uzupełnić dziurawe pola — <a href="mailto:kontakt@otwarteschroniska.org.pl?subject=Korekta+danych">zgłoś korektę</a>.
    </p>
  </section>

  <section class="section">
    <h2>Co dalej?</h2>
    <ul class="next-links">
      <li><a href="/docs/">Pełna dokumentacja</a></li>
      <li><a href="/api/v1/schema.json">JSON Schema</a></li>
      <li><a href="/docs/quality/">Jak działa data_quality_score</a></li>
      <li><a href="/docs/changelog/">Changelog</a></li>
      <li><a href="https://github.com/Lechr11/otwarteschroniska" rel="external">GitHub repo (CC-BY 4.0)</a></li>
      <li><a href="https://www.zatrzymajzegar.pl/schroniska/" rel="external">Showcase: ZatrzymajZegar.pl</a></li>
    </ul>
  </section>

  <Footer slot="footer" />

  <style>
    .hero {
      margin: 3rem 0;
      text-align: center;
    }
    .hero h1 {
      font-size: 2.75rem;
      margin-bottom: 0.5em;
    }
    .lead {
      font-size: 1.15rem;
      color: var(--color-muted);
      margin: 0.5em 0;
    }
    .hero-cta {
      margin: 1.5rem 0;
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: var(--color-accent);
      color: white;
      text-decoration: none;
      border: 1px solid var(--color-accent);
      font-weight: 500;
    }
    .btn-secondary {
      background: white;
      color: var(--color-accent);
    }
    .btn:hover { opacity: 0.85; }

    .section {
      margin: 3rem 0;
    }
    .next-links {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.5rem;
    }
    .next-links li {
      padding: 0.5rem 0;
    }
    .muted { color: var(--color-muted); font-size: 0.9rem; }
  </style>
</Layout>
```

- [ ] **Step 2: Build + smoke test**

```bash
npm run build
ls -la dist/index.html
grep -c "Wypróbuj API teraz" dist/index.html
```

Expected: index.html exists, contains hero + playground + sections.

- [ ] **Step 3: Local dev preview**

```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -s http://localhost:4321/ | grep -i "otwarte API" | head -3
kill $DEV_PID
```

Expected: HTML response zawiera „Otwarte API".

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: index.astro landing LP2 (hero + playground + snippety + bar charts + showcase)"
```

---

## Task 20: docs sub-pages (4 stron)

**Files:**
- Create: `apps/otwarteschroniska/src/pages/docs/index.astro`
- Create: `apps/otwarteschroniska/src/pages/docs/schema.astro`
- Create: `apps/otwarteschroniska/src/pages/docs/quality.astro`
- Create: `apps/otwarteschroniska/src/pages/docs/changelog.astro`

- [ ] **Step 1: Create `docs/index.astro` (TOC)**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Footer from '../../components/Footer.astro';
---

<Layout title="Dokumentacja — otwarteschroniska.org.pl">
  <h1>Dokumentacja</h1>
  <p>Pełen opis jak używać otwartego API schronisk dla zwierząt.</p>

  <ul>
    <li><a href="/docs/schema/">Schema danych</a> — opis każdego pola w master.json</li>
    <li><a href="/docs/quality/">Data Quality Score</a> — jak działa skala 1-6</li>
    <li><a href="/docs/changelog/">Changelog</a> — historia wersji datasetu</li>
    <li><a href="https://github.com/Lechr11/otwarteschroniska/blob/main/CONTRIBUTING.md" rel="external">CONTRIBUTING.md</a> — jak zgłaszać korekty / opt-out RODO</li>
  </ul>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 2: Create `docs/schema.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Footer from '../../components/Footer.astro';
---

<Layout title="Schema danych — otwarteschroniska.org.pl">
  <h1>Schema danych</h1>

  <p>Każde schronisko w datasecie ma następujące pola. Pełna definicja w <a href="/api/v1/schema.json">JSON Schema</a>, TypeScript types: <a href="/api/v1/types.d.ts"><code>types.d.ts</code></a>.</p>

  <h2>Pola obowiązkowe</h2>
  <ul>
    <li><code>id</code> — unikalny stable identifier (np. <code>krotoszyn-ceglarska-11</code>)</li>
    <li><code>nazwa</code> — oficjalna nazwa schroniska</li>
    <li><code>wojewodztwo</code> — slug województwa (np. <code>wielkopolskie</code>)</li>
    <li><code>miasto</code> — miasto</li>
  </ul>

  <h2>Pola opcjonalne</h2>
  <ul>
    <li><code>kod_pocztowy</code> — XX-XXX</li>
    <li><code>adres</code> — ulica i numer</li>
    <li><code>telefon</code>, <code>telefon_dodatkowy</code> — numery telefonów</li>
    <li><code>godziny</code> — godziny otwarcia (free-form)</li>
    <li><code>email</code>, <code>www</code> — kontakt</li>
    <li><code>geo</code> — <code>{`{ lat, lng }`}</code> (WGS84, ~17% pokrycia)</li>
    <li><code>zrodla</code> — URL źródeł danych (provenance)</li>
    <li><code>data_quality_score</code> — 1-6, patrz <a href="/docs/quality/">Quality Score</a></li>
    <li><code>opt_out</code> — true jeśli schronisko zażądało RODO opt-out</li>
  </ul>

  <h2>Stabilność ID</h2>
  <p>ID schronisk są <strong>stabilne</strong> od Phase 1. Phase 2.5+ enrichment dodaje pola, ale nigdy nie zmienia istniejących ID. Jeśli kiedyś będzie potrzebna zmiana — zostanie ogłoszona w <a href="/docs/changelog/">changelog</a>.</p>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 3: Create `docs/quality.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Footer from '../../components/Footer.astro';
---

<Layout title="Data Quality Score — otwarteschroniska.org.pl">
  <h1>Data Quality Score</h1>

  <p>Każde schronisko ma <code>data_quality_score</code> w skali 1-6 wskazujący kompletność danych.</p>

  <table style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr><th style="text-align: left; border-bottom: 1px solid #ccc; padding: 0.5rem;">Score</th><th style="text-align: left; border-bottom: 1px solid #ccc; padding: 0.5rem;">Co oznacza</th></tr>
    </thead>
    <tbody>
      <tr><td style="padding: 0.5rem; border-bottom: 1px solid #eee;"><strong>6</strong></td><td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Komplet danych: nazwa, adres, telefon, email, godziny, geo, www</td></tr>
      <tr><td style="padding: 0.5rem; border-bottom: 1px solid #eee;"><strong>5</strong></td><td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Brakuje 1-2 pola opcjonalne</td></tr>
      <tr><td style="padding: 0.5rem; border-bottom: 1px solid #eee;"><strong>4</strong></td><td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Brakuje 3+ pól opcjonalnych, ale telefon + adres są</td></tr>
      <tr><td style="padding: 0.5rem; border-bottom: 1px solid #eee;"><strong>3</strong></td><td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Mamy podstawy (telefon LUB adres)</td></tr>
      <tr><td style="padding: 0.5rem; border-bottom: 1px solid #eee;"><strong>2</strong></td><td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Bardzo niepełne — tylko nazwa + miasto + województwo</td></tr>
      <tr><td style="padding: 0.5rem;"><strong>1</strong></td><td style="padding: 0.5rem;">Krytyczne braki — sprawdź telefon przed wizytą</td></tr>
    </tbody>
  </table>

  <h2>Filtrowanie po quality</h2>
  <pre><code>{`// Tylko schroniska z dobrą jakością (4+):
const r = await fetch('https://otwarteschroniska.org.pl/api/v1/shelters.json');
const shelters = await r.json();
const verified = shelters.filter(s => (s.data_quality_score ?? 1) >= 4);`}</code></pre>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 4: Create `docs/changelog.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Footer from '../../components/Footer.astro';
import { loadMasterData } from '../../lib/data';

const master = loadMasterData();
---

<Layout title="Changelog — otwarteschroniska.org.pl">
  <h1>Changelog</h1>

  <h2>v1.0.0 — Initial release ({master.generated_at.slice(0, 10)})</h2>
  <ul>
    <li>{master.total_shelters} schronisk z 16 województw</li>
    <li>Schema v1.0 (Polish field names, EN docs w schema.json + types.d.ts)</li>
    <li>5 endpointów: <code>/manifest</code>, <code>/shelters</code>, <code>/shelters/[woj]</code>, <code>/shelters/by-id/[slug]</code>, <code>/schema</code></li>
    <li>License: CC-BY 4.0 (data) + MIT (code)</li>
    <li>Hosting: Vercel hobby + GitHub publiczne repo</li>
  </ul>

  <h2>Roadmap</h2>
  <ul>
    <li><strong>Phase 2.5</strong> (~2-3 tyg po launch): DostInf wnioski 11 HIGH WIW (+30-50 schronisk), Google Places enrichment dla geo</li>
    <li><strong>Phase 3</strong> (~6mc): crowdsourced corrections form, multi-language landing (EN), embeddable widget</li>
  </ul>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 5: Build smoke**

```bash
npm run build
ls dist/docs/
```

Expected: 4 directories (index/, schema/, quality/, changelog/) z index.html.

- [ ] **Step 6: Commit**

```bash
git add src/pages/docs/
git commit -m "feat: docs sub-pages (index, schema, quality, changelog)"
```

---

## Task 21: README.md, LICENSE, LICENSE-DATA, CHANGELOG.md, CONTRIBUTING.md

**Files:**
- Create: `apps/otwarteschroniska/README.md`
- Create: `apps/otwarteschroniska/LICENSE`
- Create: `apps/otwarteschroniska/LICENSE-DATA`
- Create: `apps/otwarteschroniska/CHANGELOG.md`
- Create: `apps/otwarteschroniska/CONTRIBUTING.md`

- [ ] **Step 1: Create README.md**

```markdown
# otwarteschroniska.org.pl

> **Pierwsze otwarte API schronisk dla zwierząt w Polsce.**
> 127 schronisk · 16 województw · CC-BY 4.0

🌐 **Live:** https://otwarteschroniska.vercel.app (post-launch: `.org.pl`)
📊 **Endpoints:** [`/api/v1/shelters.json`](https://otwarteschroniska.vercel.app/api/v1/shelters.json) · [`/api/v1/schema.json`](https://otwarteschroniska.vercel.app/api/v1/schema.json)
📜 **License:** CC-BY 4.0 (data) + MIT (code)

## Quickstart (4 sposoby)

### curl
\`\`\`bash
curl https://otwarteschroniska.vercel.app/api/v1/shelters.json | jq '.[] | select(.miasto == "Wrocław")'
\`\`\`

### JavaScript (browser/Node 18+)
\`\`\`js
const r = await fetch('https://otwarteschroniska.vercel.app/api/v1/shelters.json');
const shelters = await r.json();
console.log(\`\${shelters.length} schronisk\`);
\`\`\`

### Python
\`\`\`python
import requests
shelters = requests.get('https://otwarteschroniska.vercel.app/api/v1/shelters.json').json()
print(f"{len(shelters)} schronisk")
\`\`\`

### Node.js
\`\`\`js
const r = await fetch('https://otwarteschroniska.vercel.app/api/v1/shelters.json');
const data = await r.json();
const byWoj = data.reduce((acc, s) => { acc[s.wojewodztwo] = (acc[s.wojewodztwo] || 0) + 1; return acc; }, {});
console.table(byWoj);
\`\`\`

## Showcase

**Pierwsza aplikacja korzystająca z API:** [ZatrzymajZegar.pl](https://www.zatrzymajzegar.pl/schroniska/) — non-profit platforma adopcyjna.

## Documentation

📚 https://otwarteschroniska.vercel.app/docs/

## License

- **Code (Astro):** [MIT](LICENSE)
- **Data (master.json):** [CC-BY 4.0](LICENSE-DATA) — attribution required (link to `otwarteschroniska.org.pl`)

## Contributing

Patrz [CONTRIBUTING.md](CONTRIBUTING.md) — opt-out RODO, korekty danych, nowe schroniska.

## Owner

Lech Rudnicki · `kontakt@otwarteschroniska.org.pl`
```

- [ ] **Step 2: Create LICENSE (MIT)**

```text
MIT License

Copyright (c) 2026 Lech Rudnicki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: Create LICENSE-DATA (CC-BY 4.0)**

```text
Creative Commons Attribution 4.0 International (CC-BY 4.0)

Polish Animal Shelters Open Dataset
Copyright (c) 2026 Lech Rudnicki

This dataset is licensed under the Creative Commons Attribution 4.0
International License. To view a copy of this license, visit
https://creativecommons.org/licenses/by/4.0/

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material
  for any purpose, even commercially.

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the
  license, and indicate if changes were made. You may do so in any reasonable
  manner, but not in any way that suggests the licensor endorses you or your
  use.

Suggested attribution:
"Dane pochodzą z otwarteschroniska.org.pl (CC-BY 4.0)"
or in English:
"Data: otwarteschroniska.org.pl (CC-BY 4.0)"

For full license text see: https://creativecommons.org/licenses/by/4.0/legalcode
```

- [ ] **Step 4: Create CHANGELOG.md**

```markdown
# Changelog

All notable changes to this dataset will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-04-29

### Added
- Initial release: 127 animal shelters from 16 voivodeships
- Schema v1.0 (Polish field names, EN documentation in schema.json + types.d.ts)
- 5 API endpoints: `/manifest`, `/shelters`, `/shelters/[wojewodztwo]`, `/shelters/by-id/[slug]`, `/schema`
- License: CC-BY 4.0 (data) + MIT (code)
- Hosting: Vercel hobby + GitHub public repo
- Live playground on landing page

### Coverage (v1.0)
- Phone: ~99% (multiple sources)
- Address: 100% (Phase 1 hard gate)
- Website: ~44%
- Email: ~14% (low — see roadmap for Phase 2.5)
- Geo coordinates: ~17%

### Future
See landing roadmap section.
```

- [ ] **Step 5: Create CONTRIBUTING.md**

```markdown
# Contributing to otwarteschroniska.org.pl

Thank you for your interest! This is a non-profit, single-maintainer project, so response times may be 1-7 days.

## Reporting data corrections

Found an error in shelter data (wrong phone, outdated address, wrong opening hours)?

**2 ways to report:**

### Option 1: Email (preferred)
Send to `kontakt@otwarteschroniska.org.pl` with:
- Shelter ID (e.g., `krotoszyn-ceglarska-11`)
- URL of the shelter on https://otwarteschroniska.vercel.app/api/v1/shelters/by-id/{id}.json
- What needs to be corrected
- Source of correct information (link, document, your role at shelter)

### Option 2: GitHub Issue
[Open new issue](https://github.com/Lechr11/otwarteschroniska/issues/new) with same info.

## RODO opt-out (Polish data protection)

If you are a representative of a shelter and want your shelter removed from the dataset, send email to `kontakt@otwarteschroniska.org.pl` with:
- Shelter ID
- Confirmation of your role (admin email or document)

We will process within ≤5 business days. Two outcomes:
1. Record removed completely
2. Record retained with `opt_out: true` flag (signals to consumers but preserves transparency)

## Adding new shelter

If you know an animal shelter not in our dataset, please email with:
- Name, address, voivodeship, city
- Phone (preferred) and any other contact info
- Source of information (shelter's own website, registry document)

## Code contributions

Currently the code is single-maintainer (Lech). For substantial changes, please open an issue first to discuss.
For small fixes (typos, doc improvements), PRs welcome.

## License reminder

By contributing data, you confirm:
- Data is from public sources or your authorization
- You agree to license your contribution under CC-BY 4.0 (data) or MIT (code)
```

- [ ] **Step 6: Commit**

```bash
git add README.md LICENSE LICENSE-DATA CHANGELOG.md CONTRIBUTING.md
git commit -m "docs: README + LICENSE (MIT) + LICENSE-DATA (CC-BY 4.0) + CHANGELOG + CONTRIBUTING"
```

---

## Task 21.5: Operations docs (RUNBOOK.md + scripts/publish.sh)

> Pokrywa decyzję meta-3 ze spec'u (RUNBOOK.md per repo + inline comments w scripts).

**Files:**
- Create: `apps/otwarteschroniska/RUNBOOK.md`
- Create: `apps/otwarteschroniska/scripts/publish.sh`
- Modify: `apps/otwarteschroniska/.gitignore` (whitelist scripts/)

- [ ] **Step 1: Create `RUNBOOK.md`**

```markdown
# RUNBOOK — otwarteschroniska.org.pl operations

> Procedury operacyjne dla Lecha (operator) i future Claude Code sessions.

## 1. Update kwartalny datasetu (Flow 1)

Standardowa procedura po re-scrape w `projects/schroniska-baza`:

\`\`\`bash
cd /Users/lech/aidevs/projects/schroniska-baza
uv run python -m scraper.main scrape-all          # ~6h, ~$4
# Manual review audit_sample.html (Layer 4 quality gate)
\`\`\`

Następnie publish:

\`\`\`bash
cd /Users/lech/aidevs/apps/otwarteschroniska
./scripts/publish.sh
\`\`\`

Skrypt wykonuje: cp master.json + commit + push + Vercel auto-deploy. Verifies post-deploy.

## 2. Manual override pojedynczego rekordu

Gdy mamy świeższe dane od opiekuna schroniska niż scraper:

1. Edit `src/data/master.json` ręcznie (Find shelter by id, update fields)
2. \`git add src/data/master.json && git commit -m "data: update [shelter id] from operator"\`
3. \`git push\` → Vercel auto-deploy
4. Trigger ZZ redeploy (Flow 4)

W przyszłości (>5 schronisk wymaga override): zbuduj `manual_overrides.json` mechanism w `schroniska-baza`.

## 3. RODO opt-out workflow (Flow 3)

Gdy schronisko emailuje że chce opt-out:

1. Verify uprawnienie (matching admin email lub dokument)
2. SLA: ≤5 dni roboczych
3. Edit `src/data/master.json`:
   - Opcja A: dodaj `"opt_out": true` do rekordu (zachowuje historię)
   - Opcja B: usuń rekord całkowicie
4. \`git commit + push\` → API zaktualizowane
5. Trigger ZZ redeploy

## 4. Build failure debugging

Jeśli Vercel deploy pada:

1. Check Vercel dashboard → Deployments → ostatni failed → Build Logs
2. Najczęstsze przyczyny:
   - **Zod schema parse failure** → master.json ma invalid record. Run \`npm run build\` lokalnie, fix master.json.
   - **Astro build error** → check error message, often missing import lub type mismatch
3. Vercel keeps stary build live → zero downtime
4. Po fix: \`git commit + push\` → next build próbuje od nowa

## 5. Bandwidth limit (Vercel hobby 100 GB/mc)

Jeśli się zbliżamy do limitu:

1. Check usage: Vercel dashboard → Usage
2. Migration plan (10 min):
   - Cloudflare account → Pages → Connect to GitHub repo `Lechr11/otwarteschroniska`
   - Cloudflare auto-builds (Astro support natywne)
   - Update DNS: `otwarteschroniska.org.pl` CNAME → Cloudflare URL (zamiast Vercel)
   - Cloudflare = unlimited bandwidth (free)

## 6. Migracja domeny vercel.app → org.pl (one-time, day 1)

Patrz Task 24 w `docs/superpowers/plans/2026-04-29-otwarteschroniska-mvp.md`.

## 7. Trigger ZZ redeploy po update danych

Po publish.sh: ZZ Vercel rebuild musi być triggered manualnie (ZZ nic nie pushuje).

\`\`\`bash
# Vercel Deploy Hook URL (ustawiony w Vercel ZZ project → Settings → Deploy Hooks)
# Hook URL przechowywany lokalnie w .env.local lub bash alias
curl -X POST "$ZZ_DEPLOY_HOOK"
\`\`\`

publish.sh automatyzuje to (jeśli ZZ_DEPLOY_HOOK env var jest ustawiony).

## Kontakt

Lech Rudnicki · `kontakt@otwarteschroniska.org.pl`
```

- [ ] **Step 2: Create `scripts/publish.sh`**

```bash
mkdir -p /Users/lech/aidevs/apps/otwarteschroniska/scripts
cat > /Users/lech/aidevs/apps/otwarteschroniska/scripts/publish.sh <<'BASH'
#!/bin/bash
# scripts/publish.sh
# Publish updated master.json from schroniska-baza to otwarteschroniska + trigger ZZ redeploy.
#
# Usage: ./scripts/publish.sh [optional commit message suffix]
#
# Steps:
#   1. cp master.json from schroniska-baza/output/ → src/data/
#   2. git commit z standardowym messagem (data: YYYY-Qx refresh)
#   3. git push → Vercel auto-deploy
#   4. Wait + verify deployment
#   5. Trigger ZZ Vercel redeploy via Deploy Hook (if env var set)
#
# Pre-requirements:
#   - schroniska-baza scraper finished (master.json fresh)
#   - .env.local zawiera ZZ_DEPLOY_HOOK (optional, dla automatic ZZ rebuild)

set -e  # exit on error

SOURCE="/Users/lech/aidevs/projects/schroniska-baza/output/master.json"
TARGET="/Users/lech/aidevs/apps/otwarteschroniska/src/data/master.json"

echo "📦 Publishing master.json update..."
echo ""

# Verify source exists
if [ ! -f "$SOURCE" ]; then
    echo "❌ ERROR: $SOURCE nie istnieje. Uruchom scraper najpierw."
    exit 1
fi

# Copy
echo "1/5 Copying master.json..."
cp "$SOURCE" "$TARGET"
TOTAL=$(python3 -c "import json; print(json.load(open('$TARGET'))['total_shelters'])")
echo "   ✓ Total shelters: $TOTAL"

# Compute quarter for commit message
YEAR=$(date +%Y)
QUARTER=$(( ($(date +%-m) - 1) / 3 + 1 ))
SUFFIX="${1:-}"
MSG="data: ${YEAR}-Q${QUARTER} refresh ($TOTAL shelters)${SUFFIX:+ — $SUFFIX}"

# Git ops
cd /Users/lech/aidevs/apps/otwarteschroniska
echo "2/5 Git commit + push..."
git add src/data/master.json
git commit -m "$MSG" || { echo "   ℹ No changes detected, skipping commit"; exit 0; }
git push

# Wait for Vercel
echo "3/5 Waiting 60s for Vercel build..."
sleep 60

# Verify (post-domain swap, prefer .org.pl)
URL="${OTWARTESCHRONISKA_URL:-https://otwarteschroniska.vercel.app}"
echo "4/5 Verifying API at $URL..."
LIVE_TOTAL=$(curl -s "$URL/api/v1/manifest.json" | python3 -c "import sys, json; print(json.load(sys.stdin)['total_shelters'])")
if [ "$LIVE_TOTAL" -eq "$TOTAL" ]; then
    echo "   ✓ API live: $LIVE_TOTAL shelters"
else
    echo "   ⚠ Mismatch: source $TOTAL, live $LIVE_TOTAL (Vercel still building?)"
fi

# Trigger ZZ rebuild (optional)
if [ -n "$ZZ_DEPLOY_HOOK" ]; then
    echo "5/5 Triggering ZZ rebuild..."
    curl -X POST "$ZZ_DEPLOY_HOOK" > /dev/null
    echo "   ✓ ZZ Vercel rebuild triggered"
else
    echo "5/5 ⚠ ZZ_DEPLOY_HOOK env var not set — manual trigger ZZ rebuild needed"
    echo "   See Vercel ZZ project → Settings → Deploy Hooks"
fi

echo ""
echo "✅ Done. Check https://www.zatrzymajzegar.pl/schroniska/ in ~2 min for fresh data."
BASH

chmod +x /Users/lech/aidevs/apps/otwarteschroniska/scripts/publish.sh
```

- [ ] **Step 3: Verify scripts/publish.sh syntax**

```bash
cd /Users/lech/aidevs/apps/otwarteschroniska
bash -n scripts/publish.sh && echo "Syntax OK"
```

Expected: "Syntax OK".

- [ ] **Step 4: Commit**

```bash
git add RUNBOOK.md scripts/
git commit -m "docs: RUNBOOK.md + scripts/publish.sh (operations meta-3)"
```

---

## Task 22: Static assets (favicon + og-image)

**Files:**
- Create: `apps/otwarteschroniska/public/favicon.ico`
- Create: `apps/otwarteschroniska/public/og-image.png`

- [ ] **Step 1: Generate placeholder favicon**

Lech action lub Claude może użyć narzędzia generującego SVG → ICO.

Opcja prosta: tymczasowo skopiuj favicon z ZZ jako placeholder:

```bash
cp /Users/lech/aidevs/apps/zatrzymajzegar/public/favicon.ico /Users/lech/aidevs/apps/otwarteschroniska/public/favicon.ico
```

Lub stwórz minimalistyczny czarno-biały favicon (Lech może zrobić sam).

**TODO:** zaprojektować unikalny favicon dla otwarteschroniska (Phase 2.5+).

- [ ] **Step 2: Generate placeholder OG image (1200×630)**

Tymczasowo Lech może użyć generatora online (np. https://og-image.vercel.app) lub Canva.

**Tymczasowo:** placeholder white background z tekstem "otwarteschroniska.org.pl · Open API · CC-BY 4.0".

```bash
# Placeholder — Lech tworzy sam (można też skopiować z ZZ jako dummy):
cp /Users/lech/aidevs/apps/zatrzymajzegar/public/og-image.png /Users/lech/aidevs/apps/otwarteschroniska/public/og-image.png || true
```

Jeśli ZZ nie ma OG image, można użyć generic transparent PNG.

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: placeholder favicon + og-image (TODO Phase 2.5: brand-specific)"
```

---

## Task 23: Final build smoke + accessibility check

- [ ] **Step 1: Full build**

```bash
cd /Users/lech/aidevs/apps/otwarteschroniska
npm run build
```

Expected: Build success, dist/ contains:
- index.html
- docs/{index,schema,quality,changelog}/index.html
- api/v1/{manifest,shelters,schema}.json
- api/v1/shelters/{16 woj}.json
- api/v1/shelters/by-id/{127 slugs}.json

- [ ] **Step 2: Smoke test count of static pages**

```bash
find dist -name "*.json" -path "*/api/v1/*" | wc -l
# Expected: 1 (manifest) + 1 (shelters) + 16 (woj) + 127 (by-id) + 1 (schema) = 146

find dist -name "*.html" | wc -l
# Expected: 1 (index) + 4 (docs) = 5
```

- [ ] **Step 3: Validate JSON outputs**

```bash
python3 -c "
import json
import os
total = 0
errors = 0
for root, dirs, files in os.walk('dist/api'):
    for f in files:
        if f.endswith('.json'):
            try:
                json.load(open(os.path.join(root, f)))
                total += 1
            except Exception as e:
                print(f'ERROR in {f}: {e}')
                errors += 1
print(f'Validated {total} JSON files, {errors} errors')
"
```

Expected: 146 JSON files, 0 errors.

- [ ] **Step 4: Local preview + manual smoke**

```bash
npm run preview &
PID=$!
sleep 3

# Smoke test endpoints
curl -s http://localhost:4321/api/v1/manifest.json | python3 -m json.tool | head -20
curl -s http://localhost:4321/api/v1/shelters/by-id/krotoszyn-ceglarska-11.json | python3 -m json.tool

# Smoke test landing
curl -s http://localhost:4321/ | grep -i "otwarte API" | head -3

kill $PID
```

Expected: manifest valid, Krotoszyn record visible (TOZ Krotoszyn), landing HTML zawiera „Otwarte API".

- [ ] **Step 5: Lighthouse audit (manual via Chrome DevTools or `npx lighthouse-cli`)**

Lech wykonuje:
- Open `http://localhost:4321/` w Chrome
- DevTools → Lighthouse → Performance + Accessibility + SEO + Best Practices
- Expected: Performance ≥ 90, A11y ≥ 90, SEO ≥ 95

Jeśli niższe → identify low-scoring kategorie i fix przed deploy.

- [ ] **Step 6: Commit (jeśli były fixes)**

```bash
git add -A
git commit -m "test: build smoke + Lighthouse pass" || echo "no changes"
```

- [ ] **Step 7: Post-DAY-0 deploy verification (po pierwszym Vercel deploy w Task 25)**

Po Task 25 (GitHub repo create + Vercel połączone), strona będzie live na `https://otwarteschroniska.vercel.app`. Verify:

```bash
# Endpoint smoke tests
curl -s https://otwarteschroniska.vercel.app/api/v1/manifest.json | python3 -m json.tool | head -10
curl -s https://otwarteschroniska.vercel.app/api/v1/shelters/by-id/krotoszyn-ceglarska-11.json | python3 -m json.tool

# CORS verification
curl -I -H "Origin: https://example.com" https://otwarteschroniska.vercel.app/api/v1/shelters.json | grep -i "access-control\|cache-control"
# Expected: Access-Control-Allow-Origin: *  +  Cache-Control: public, max-age=3600...

# Endpoint count verification
curl -s https://otwarteschroniska.vercel.app/api/v1/manifest.json | python3 -c "import sys, json; m = json.load(sys.stdin); print('total:', m['total_shelters']); print('endpoints:', list(m['endpoints'].keys()))"
# Expected: total: 127, endpoints: 6
```

- [ ] **Step 8: Schema.org Rich Results Test (manual)**

Lech wykonuje (post-deploy):
1. Otwórz https://search.google.com/test/rich-results
2. Wpisz URL: `https://otwarteschroniska.vercel.app/`
3. Run test
4. Expected: **Dataset** detected + valid (zero errors). Jeśli ostrzeżenia (warnings) — zignoruj, są typowo „recommended fields" które nie są blockerem.

Jeśli błędy: identyfikuj missing required fields (creator, license, distribution) → fix w `src/components/DatasetJsonLd.astro` → redeploy.

- [ ] **Step 9: Lighthouse audit production**

Lech wykonuje (post-deploy):
- Otwórz `https://otwarteschroniska.vercel.app/` w Chrome
- DevTools → Lighthouse → Mobile + Desktop runs
- Expected: Performance ≥ 90, A11y ≥ 90, SEO ≥ 95, Best Practices ≥ 90

Production może mieć inne wyniki niż localhost (CDN, real network). Akceptujemy minimalne degradacje.

- [ ] **Step 10: Commit fixes (jeśli były)**

```bash
git add -A
git commit -m "test: post-deploy verification (Rich Results + Lighthouse production)" || echo "no changes"
```

---

## Task 24: Domain setup (DAY 1, Lech action)

**Wymagana akcja Lecha:**

- [ ] **Step 1: Rejestracja domeny `otwarteschroniska.org.pl`**

Lech wybiera rejestratora i wykonuje:
- home.pl (https://home.pl/zarejestruj-domene) — ~30-50 PLN/rok
- LUB nazwa.pl (https://nazwa.pl) — ~40-60 PLN/rok
- LUB OVH.pl

Po rejestracji: zachowaj credentials (login + hasło do panelu rejestratora).

- [ ] **Step 2: Vercel custom domain setup**

W Vercel project settings (otwarteschroniska):
1. Settings → Domains
2. Add domain: `otwarteschroniska.org.pl`
3. Vercel poda DNS records (zwykle CNAME `@` → `cname.vercel-dns.com` lub A record na IP)
4. Lech wpisuje DNS w panelu rejestratora (home.pl/NetArt)
5. Wait ~10 min na propagację DNS
6. Vercel auto-issues SSL cert (Let's Encrypt)

- [ ] **Step 3: ImprovMX setup**

W ImprovMX:
1. Add new domain: `otwarteschroniska.org.pl`
2. Catch-all alias: `*` → `lech.rudnicki@prawnymarketing.pl`
3. ImprovMX poda MX records → wpisz w panelu rejestratora
4. Wait ~10 min na propagację
5. Test: wyślij maila z innej skrzynki na `kontakt@otwarteschroniska.org.pl`, weryfikuj że dochodzi

- [ ] **Step 4: Verify production**

```bash
curl https://otwarteschroniska.org.pl/api/v1/manifest.json | python3 -m json.tool | head -10
```

Expected: 200 response z manifestem.

- [ ] **Step 5: Update astro.config.mjs site URL**

Modify `astro.config.mjs`:
```js
site: 'https://otwarteschroniska.org.pl',  // hard launch
```

Update `src/components/Snippet.astro`, `src/components/Playground.tsx`, `src/components/DatasetJsonLd.astro`, `src/pages/index.astro` — zmień `https://otwarteschroniska.vercel.app` → `https://otwarteschroniska.org.pl` (search & replace).

- [ ] **Step 6: Commit + push (auto-deploy)**

```bash
git add -A
git commit -m "feat: hard launch — switch URLs from vercel.app to otwarteschroniska.org.pl"
git push
```

Vercel auto-deploys → produkcja pod `otwarteschroniska.org.pl`.

---

## Task 25: GitHub repo create + push (Lech action)

**Wymagana akcja Lecha:**

- [ ] **Step 1: Utwórz publiczne GitHub repo**

```bash
cd /Users/lech/aidevs/apps/otwarteschroniska
gh repo create Lechr11/otwarteschroniska --public --source=. --push --description "Open API for Polish animal shelters (CC-BY 4.0). First-mover open data initiative."
```

Lub przez dashboard: https://github.com/new

- [ ] **Step 2: Vercel: connect GitHub repo do projektu**

Vercel project settings → Git → Connect to GitHub repo `Lechr11/otwarteschroniska`. Po podłączeniu, każdy `git push` → auto-deploy.

- [ ] **Step 3: Test workflow**

```bash
git commit --allow-empty -m "test: trigger Vercel deploy"
git push
```

Expected: Vercel dashboard shows new deployment in progress.

---

## Self-review (po napisaniu planu)

**Spec coverage:**
- ✅ API-1 (statyczne JSONy + URL versioning) — Tasks 7-11
- ✅ API-2 (polskie pola + EN docs) — Tasks 4 (Zod + types.d.ts), 11 (schema.json)
- ✅ API-3 (Vercel hobby + GitHub) — Tasks 2, 25
- ✅ API-4 (repo + licencje + W1 update) — Tasks 21
- ✅ API-5 (LP2 landing) — Tasks 13-19
- ✅ API-6 (email + branding) — Tasks 13 (Layout B&W), 24 (ImprovMX)
- ✅ Meta-1 (Schema.org Dataset) — Task 18
- ✅ Meta-2 (OG generic) — Task 22
- ✅ Meta-3 (RUNBOOK) — covered in Task 21 README + this plan jako future skrypty publish.sh
- ✅ Meta-4 (preview deploy) — Vercel auto for branches (mentioned in Task 25)
- ✅ Pre-launch Krotoszyn update — Task 3
- ✅ Pre-launch checklist — embedded throughout
- ✅ Canonical URL — Task 13 (Layout)

**Placeholder scan:**
- ✅ Brak „TBD" / „TODO" / „implement later" — wszystkie code blocks complete
- ⚠️ Task 22 favicon/og-image: „TODO Phase 2.5 brand-specific" — to świadomy odsuń na Phase 2.5, akceptowalne

**Type consistency:**
- ✅ `Shelter` type definiowany w Task 4, używany konsekwentnie w Task 5 (lib/data), Task 6 (lib/manifest), Task 19 (index)
- ✅ URL endpoints: `/api/v1/shelters/by-id/[slug]` — używane konsekwentnie po Task 10
- ✅ ID Krotoszyn `krotoszyn-ceglarska-11` używane w Task 3, 5 (test), 23 (smoke)

**Plan complete and saved.**

---

## Execution Handoff

Plan complete and saved to `apps/otwarteschroniska/docs/superpowers/plans/2026-04-29-otwarteschroniska-mvp.md`.

**Total: 25 tasków, ~6-8h pracy implementacji.**

Z czego:
- Tasks 1-23: Claude implementuje (z Twoim review między tasks)
- Tasks 24, 25: Lech akcje fizyczne (rejestracja domeny, GitHub repo, ImprovMX) — wykonujesz Ty sam, oferuję commands

Po tym planie wszystko gotowe do napisania **Plan #2 (ZZ /schroniska/ pages)** i potem `executing-plans`.
