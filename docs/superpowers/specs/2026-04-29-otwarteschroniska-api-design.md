# `otwarteschroniska.org.pl` — Design Doc (MVP v1.0)

> Sub-projekt 1 z dwóch. Spec ten definiuje otwarte API + landing.
> Sub-projekt komplementarny: `apps/zatrzymajzegar/docs/superpowers/specs/2026-04-29-schroniska-pages-design.md` (ZZ jako first consumer API).
>
> **Data utworzenia:** 2026-04-29
> **Autor:** Lech Rudnicki (mentor: Claude Sonnet 4.6)
> **Status:** brainstorming complete, ready for `writing-plans`

---

## 1. Cel projektu

`otwarteschroniska.org.pl` to **pierwsze otwarte API schronisk dla zwierząt w Polsce**. Publikuje 127 rekordów z Phase 1 scrape (`projects/schroniska-baza`) jako statyczny zbiór JSON pod licencją CC-BY 4.0.

### Cele strategiczne

| Cel | Mechanizm |
|---|---|
| Backlinki dla `zatrzymajzegar.pl` | GitHub README link + atrybucja CC-BY 4.0 w aplikacjach trzecich |
| Pozycja "first mover" w polskim open animal data | Opublikowany przed konkurencją, narracja w mediach |
| Wzmocnienie SEO ZZ | ZZ jako "first consumer" → cross-promo z otwarteschroniska |
| Wartość dla społeczności devów | Łatwe API, dobre docs, live playground |

### Zakres MVP (świadome wykluczenia)

- ❌ Backend, baza danych, autoryzacja (statyczne JSONy)
- ❌ Dynamiczne filtry server-side (konsumenci filtrują po stronie klienta)
- ❌ Rate limiting per IP (Cache-Control + CDN edge wystarczają)
- ❌ Email subscription / webhooks
- ❌ Multi-language landing (polski only na MVP)
- ❌ Crowdsourced corrections form (mailto na MVP, form w Phase 2.5+)

---

## 2. Stack techniczny

| Warstwa | Wybór | Powód |
|---|---|---|
| Framework | Astro 6 (statyczny) | Spójność z ZZ, output 100% static, native API endpoints przez `.json.ts` |
| Hosting | Vercel hobby | Free, znany ekosystem (ZZ na Vercel), CDN edge, auto-deploy on push |
| Repo | GitHub `Lechr11/otwarteschroniska` (publiczne) | Backlinks, social proof, CC-BY 4.0 attribution naturalna |
| Domena | `otwarteschroniska.vercel.app` (day 0) → `otwarteschroniska.org.pl` (day 1+) | Soft launch immediate, hard launch po rejestracji domeny |
| Licencje | MIT (kod Astro) + CC-BY 4.0 (dane) | Standard open data, jasny kontrakt dla devów |
| Email | `kontakt@otwarteschroniska.org.pl` (po domenie) → ImprovMX forward → `lech.rudnicki@prawnymarketing.pl` | Profesjonalny branding spójny z domeną |

---

## 3. Architektura wysokiego poziomu

```
┌─ projects/schroniska-baza/ (istnieje, Phase 1 done) ─┐
│ Python LLM scraper                                    │
│ output/master.json (127 schronisk, schema v1.0)       │
└──────────────┬────────────────────────────────────────┘
               │ MANUAL cp + commit (W1, ~2-4× rocznie)
               ▼
┌─ apps/otwarteschroniska/ (NEW) ───────────────────────┐
│ Astro 6 → otwarteschroniska.org.pl                    │
│ ├─ src/data/master.json (single source of truth)      │
│ ├─ src/pages/                                         │
│ │  ├─ index.astro (landing LP2: hero + playground +   │
│ │  │   4 snippets + bar charts + showcase ZZ +        │
│ │  │   schema.org Dataset JSON-LD)                    │
│ │  ├─ docs/{index,schema,quality,changelog}.astro     │
│ │  └─ api/v1/                                         │
│ │     ├─ manifest.json.ts                             │
│ │     ├─ shelters.json.ts (cały dataset)              │
│ │     ├─ shelters/[wojewodztwo].json.ts (×16)         │
│ │     ├─ shelters/[slug].json.ts (×127)               │
│ │     └─ schema.json.ts (JSON Schema z EN docs)       │
│ ├─ public/api/v1/types.d.ts (TypeScript types)        │
│ ├─ src/middleware.ts (CORS + Cache-Control)           │
│ ├─ LICENSE (MIT) + LICENSE-DATA (CC-BY 4.0)           │
│ └─ Vercel hobby + auto-deploy on push                 │
└──────────────┬────────────────────────────────────────┘
               │ HTTP fetch w build-time (ZZ konsument)
               ▼
        [apps/zatrzymajzegar — sub-projekt 2]
```

---

## 4. Decyzje konceptualne

### API-1 — Format API: statyczne JSONy

Format: pliki JSON serwowane statycznie. Wersjonowanie przez prefix URL `/api/v1/`. CORS `Access-Control-Allow-Origin: *`. Cache-Control: `public, max-age=3600, stale-while-revalidate=86400`.

**Wybrane endpointy:**
- `/api/v1/manifest.json` — metadata (schema_version, generated_at, total_shelters, license, endpoints, coverage)
- `/api/v1/shelters.json` — wszystkie 127 schronisk (`Shelter[]`)
- `/api/v1/shelters/[wojewodztwo].json` — filter per województwo (16 endpointów)
- `/api/v1/shelters/[slug].json` — pojedyncze schronisko (127 endpointów)
- `/api/v1/schema.json` — JSON Schema draft 2020-12 z opisami EN per pole
- `/api/v1/types.d.ts` (jako static asset) — TypeScript types z JSDoc EN

**Powód:** zero backendu = zero kosztów + zero maintenance, idiomatic dla open data, każdy konsument zna `fetch()` JSON. Akceptowane wykluczenie: brak dynamic filtering server-side (konsumenci filtrują client-side).

### API-2 — Schema kontraktu: polskie nazwy pól

Payload JSON używa **polskich nazw pól** (`nazwa`, `wojewodztwo`, `kod_pocztowy`, `telefon`, etc.) bez tłumaczenia.

**Bonus:** publikujemy `schema.json` (JSON Schema z opisami EN per pole) + `types.d.ts` (TypeScript z JSDoc EN). Polski payload + EN documentation = best of both worlds.

**Powód:** persona docelowa = polski programista (98% konsumentów). Wartości i tak są po polsku (`wielkopolskie`, `Krotoszyn`) — angielskie klucze + polskie wartości to dziwna mieszanka. dane.gov.pl convention.

### API-3 — Hosting + CI/CD: Vercel hobby + auto-deploy

GitHub `Lechr11/otwarteschroniska` (publiczne) → Vercel auto-build on push to `main`. Custom domain `otwarteschroniska.org.pl` (day 1+, day 0 = vercel.app subdomain).

**Powód:** spójność z ZZ ekosystemem, zero kosztu, 100 GB bandwidth/mc starczy z zapasem, auto-cert SSL, fallback do Cloudflare Pages (10 min CNAME swap) gdyby viral.

### API-4 — Repo struktura + licencje + update workflow

**Struktura:** standard Astro (src/pages, src/data, src/middleware, public/, README.md, LICENSE, LICENSE-DATA, CONTRIBUTING.md, CHANGELOG.md).

**Licencje:**
- `LICENSE` = MIT (kod Astro: src/pages/, src/middleware.ts, src/layouts/, configs)
- `LICENSE-DATA` = CC-BY 4.0 (dane: src/data/master.json + endpointy generowane)

**Update workflow (W1 — manual):** po re-scrape w `schroniska-baza`, Lech robi `cp output/master.json apps/otwarteschroniska/src/data/` + `git commit -m "data: YYYY-Qx refresh (...)"` + `git push`. Vercel auto-deploya.

**Częstotliwość:** 2-4× rocznie po re-scrape.

### API-5 — Landing page: LP2 (Try-it-now z playgroundem)

Strona główna `/` zawiera:

1. **Hero** — H1 + subtitle (127 schronisk, 16 woj, CC-BY 4.0) + CTA „Pobierz dane (master.json)"
2. **Live playground** (React island, `client:visible`) — `<select>` województwo → fetch endpoint → `<pre>` JSON pretty print. Dev widzi format w 30 sekund.
3. **4 snippety** w tabach (curl, JS browser, Python, Node.js) — każdy 5 linii, copy-paste working.
4. **Bar charts pokrycia** (statyczne SVG, dane z `manifest.json` build-time) — telefon 99.2%, email 14.2%, www 44.1%, geo 17.3% (wartości aktualne na deploy).
5. **Sekcja „Co dalej"** — linki do `/docs/*`, GitHub repo, Showcase: ZatrzymajZegar.pl, „Zgłoś korektę" (mailto).
6. **Stopka** — Powered by ZatrzymajZegar.pl, CC-BY 4.0, kontakt.

**Bonus #1 (decyzja meta-1):** Schema.org Dataset JSON-LD na landingu → free ranking w Google Dataset Search dla terminów open data.

**Sub-pages:** `/docs/index.astro`, `/docs/schema.astro`, `/docs/quality.astro` (data_quality_score 1-6 explained), `/docs/changelog.astro` (historia wersji).

### API-6 — Email kontaktowy + branding

**Email:** `kontakt@otwarteschroniska.org.pl` (po rejestracji domeny day 1) → ImprovMX catch-all → `lech.rudnicki@prawnymarketing.pl` (jak ZZ). Day 0 fallback: `kontakt@zatrzymajzegar.pl`.

**Branding:** monochrome (black/white/szarość), serif heading + sans body, bez dekoracji. Sygnał „neutralny ekosystem open data". Distinct od ZZ pomarańczowego (różny target — open data vs emotional adoption).

---

## 5. Komponenty

### Pliki API (Astro endpoints)

| Plik | URL | Zwraca |
|---|---|---|
| `src/pages/api/v1/manifest.json.ts` | `/api/v1/manifest.json` | `{schema_version, generated_at, total_shelters, license, endpoints[], coverage{telefon_pct, email_pct, www_pct, geo_pct}}` |
| `src/pages/api/v1/shelters.json.ts` | `/api/v1/shelters.json` | `Shelter[]` (cały dataset) |
| `src/pages/api/v1/shelters/[wojewodztwo].json.ts` | `/api/v1/shelters/{woj}.json` | `Shelter[]` filtrowane (16 woj) |
| `src/pages/api/v1/shelters/[slug].json.ts` | `/api/v1/shelters/{slug}.json` | `Shelter` (1 obiekt, 127 unique) |
| `src/pages/api/v1/schema.json.ts` | `/api/v1/schema.json` | JSON Schema draft 2020-12 z `description` EN |

### Middleware

`src/middleware.ts` — wstawia headers dla wszystkich `/api/*`:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`

### Library

| Plik | Eksporty |
|---|---|
| `src/lib/data.ts` | `loadShelters(): Shelter[]`, `getShelter(id): Shelter \| null`, `getSheltersByWojewodztwo(woj): Shelter[]`, type guards |
| `src/lib/manifest.ts` | `computeCoverage(shelters): {telefon_pct, email_pct, www_pct, geo_pct}` |
| `src/schemas/shelter.ts` | Zod schema `Shelter` + `ShelterArray` (parsowanie master.json przy build-time) |

### Strony

| Plik | Strona |
|---|---|
| `src/pages/index.astro` | Landing LP2 (hero + playground + snippets + bar charts + showcase + JSON-LD Dataset) |
| `src/pages/docs/index.astro` | Spis treści docs |
| `src/pages/docs/schema.astro` | Wyjaśnienie schema (link do `/api/v1/schema.json`) |
| `src/pages/docs/quality.astro` | `data_quality_score` 1-6 explained |
| `src/pages/docs/changelog.astro` | Historia wersji datasetu |

### Komponenty React + Astro

| Plik | Tech | Rola |
|---|---|---|
| `src/components/Playground.tsx` | React island (`client:visible`) | Dropdown województwo + fetch + pretty print |
| `src/components/Snippet.astro` | Static + minimalna CSS taby | 4 tabs: curl / JS / Python / Node |
| `src/components/CoverageChart.astro` | Static SVG bars | Bar charts z `manifest.json` (build-time) |
| `src/components/Footer.astro` | Static | „Powered by ZatrzymajZegar.pl · CC-BY 4.0 · Kontakt" |

### Schema.org Dataset JSON-LD

Inline w `src/pages/index.astro` (jednorazowy `<script type="application/ld+json">` w `<head>` przez `<slot name="head">` lub bezpośrednio w layout). Dane (name, description, license, distribution[], temporalCoverage) hardcoded w komponencie z linkami do `/api/v1/shelters.json`. Decyzja meta-1 (Google Dataset Search ranking).

### Layouts + assets

| Plik | Rola |
|---|---|
| `src/layouts/Layout.astro` | Minimalist B&W layout (serif heading + sans body) + `<link rel="canonical" href="${Astro.url}">` self-referential per strona |
| `public/api/v1/types.d.ts` | Statyczny TypeScript types file (Shelter interface + JSDoc EN) |
| `public/og-image.png` | OG image (1200×630, brand minimalist) |
| `public/favicon.ico` | Favicon |

### Dokumentacja repo

| Plik | Treść |
|---|---|
| `README.md` | Cel projektu + 4 snippety + linki |
| `LICENSE` | MIT (full text) |
| `LICENSE-DATA` | CC-BY 4.0 (full text + attribution example) |
| `CHANGELOG.md` | v1.0.0 — initial release (date) |
| `CONTRIBUTING.md` | Jak zgłaszać korekty (email + GitHub Issues), opt-out RODO |
| `astro.config.mjs` | Astro config + middleware register |

---

## 6. Data flows (kluczowe)

### Flow 1 — Update kwartalny datasetu (W1 manual)

```
schroniska-baza re-scrape (~6h, ~$4) →
  Layer 4 audit_sample.html review →
    cp master.json apps/otwarteschroniska/src/data/ →
      git commit -m "data: YYYY-Qx refresh" + push →
        Vercel auto-deploy (~30s) →
          curl /api/v1/manifest.json → verify total_shelters
```

### Flow 2 — Dev używa API

```
Dev znajduje otwarteschroniska.org.pl (HN, Wykop, GitHub) →
  Live playground na landingu → JSON pretty print →
    Copy snippet (curl/JS/Python/Node) →
      Buduje aplikację →
        Attribution w stopce: "Dane: otwarteschroniska.org.pl (CC-BY 4.0)"
```

### Flow 3 — Opt-out RODO

```
Schronisko email → kontakt@otwarteschroniska.org.pl →
  Manual review przez Lecha (SLA ≤5 dni) →
    Edit master.json w schroniska-baza repo:
      - dodaj opt_out: true LUB usuń rekord →
        cp + commit + push do otwarteschroniska →
          Vercel deploy → API bez tego schroniska →
            Trigger redeploy ZZ → strona /schroniska/.../[slug] removed
```

---

## 7. Error handling

| Failure | Mitigation |
|---|---|
| `master.json` corrupted | Build pada w Zod parse → helpful error → Lech fix |
| Vercel hobby bandwidth limit | Cache-Control 1h + CDN edge → CNAME swap do Cloudflare jeśli viral (10 min) |
| CORS misconfig | Test w dev mode + post-deploy `curl -I` verification |
| Schema drift breaking | Konwencja: nowe pola optional w v1, breaking → `/api/v2/`, v1 stable 12mc |
| Schronisko opt-out → stary URL z indexu | 404 Astro page (akceptowalne) |

---

## 8. Pre-launch checklist (RUNBOOK.md draft)

```
DAY 0 — soft launch na vercel.app:
□ Lech: rejestracja Vercel project (already has account)
□ Lech: tworzy apps/otwarteschroniska/ + git init
□ Astro setup, master.json copy (z aktualnym Krotoszynem!)
□ Endpoints + middleware + landing LP2
□ Vercel deploy → otwarteschroniska.vercel.app live
□ Verify: curl manifest, shelters, dolnoslaskie, krotoszyn-ceglarska-11
□ Verify: CORS headers (curl -I -H "Origin: ...")
□ Verify: Schema.org Dataset (Rich Results Test)

DAY 1 — hard launch z .org.pl:
□ Lech: rejestracja otwarteschroniska.org.pl w home.pl/NetArt
□ Lech: ImprovMX setup catch-all → lech.rudnicki@prawnymarketing.pl
□ Vercel: dodaj custom domain → DNS records (CNAME)
□ Vercel: wait for SSL cert (~10 min)
□ Test: curl https://otwarteschroniska.org.pl/api/v1/manifest.json
□ Update README.md + snippety w docs/* na nowy URL
□ ZZ Vercel: update env PUBLIC_OTWARTESCHRONISKA_API → redeploy
□ ZZ Vercel: update kontakt email mailto → kontakt@otwarteschroniska.org.pl
```

---

## 9. Pre-launch task: aktualizacja Krotoszyn record

`master.json` ma stare dane Krotoszyna. ZZ ma najświeższe w `src/content/schroniska/krotoszyn.md` (od opiekuna, sesja 7 ZZ 2026-04-27). Pre-launch:

1. Pobrać świeże dane z `apps/zatrzymajzegar/src/content/schroniska/krotoszyn.md`:
   - `nazwa`: "TOZ Krotoszyn"
   - `telefon`: "+48 660 662 191" (adopcyjny)
   - `telefon_dodatkowy`: "+48 660 662 171"
   - `godziny`: "pn-pt 10:00-15:00"
   - `email`: "krotoszyn@eadopcje.org"
2. Edit `projects/schroniska-baza/output/master.json` ręcznie — update record `id: krotoszyn-ceglarska-11`.
3. cp do `apps/otwarteschroniska/src/data/master.json`.
4. Commit + push → Vercel deploy → API ma świeże dane Krotoszyna.

W przyszłości (gdy >5 schronisk wymaga manual override) → mechanizm `manual_overrides.json` w `schroniska-baza`.

---

## 10. Testing strategy

| Test | Kiedy | Jak |
|---|---|---|
| Build smoke | Pre-deploy lokalnie | `npm run build` (Astro pada przy złym JSON / Zod) |
| Endpoint sanity | Post-deploy | `curl /api/v1/manifest.json`, shelters, slug |
| CORS check | Post-deploy | `curl -I -H "Origin: ..."` |
| Live playground | Post-deploy manual | Otwórz landing → dropdown → JSON visible |
| Schema.org Dataset | Post-deploy | Google Rich Results Test |

**Wykluczone z MVP:** unit tests vitest, GitHub Actions CI (Vercel preview = de facto CI).

---

## 11. Decyzje meta (ze ślepych plamek)

| # | Decyzja |
|---|---|
| meta-1 | Schema.org `Dataset` JSON-LD na landingu (Google Dataset Search) |
| meta-2 | OG image generic (Dynamic w Phase 2.5+) |
| meta-3 | RUNBOOK.md per repo + inline comments w `scripts/publish.sh` |
| meta-4 | Feature branch + Vercel preview deploy (atomic safety) |

---

## 12. Roadmap (po MVP)

### Phase 2.5 (~2-3 tyg po MVP launch)
- DostInf wnioski 11 HIGH WIW województw (+30-50 schronisk)
- Google Places API enrichment dla geo (~$20-50, podniesie geo% z 17% do 60%+)
- Tier 4 web fetch dla godziny + facebook + instagram

### Phase 3 (6mc+)
- Crowdsourced corrections form (zamiast mailto)
- Multi-language landing (EN dla international devów)
- Embeddable widget (mapa schronisk dla zewn. stron)
- API v2 jeśli breaking schema change

---

## 13. Pytania otwarte / TBD

- **Domena `otwarteschroniska.org.pl` rejestracja** — jutro przez Lecha (home.pl/NetArt). Spec zostaje aktualny; URLs zaktualizowane post-rejestracji.

---

## 14. Kontakt

- **Operator:** Lech Rudnicki (`kontakt@zatrzymajzegar.pl` na MVP, `kontakt@otwarteschroniska.org.pl` po rejestracji domeny)
- **Repo:** github.com/Lechr11/otwarteschroniska (publiczne)
- **Mentor sesji projektowej:** Claude Sonnet 4.6 (brainstorming complete 2026-04-29)
