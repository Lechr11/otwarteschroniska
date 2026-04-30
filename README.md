# otwarteschroniska.org.pl

> **Pierwsze otwarte API schronisk dla zwierząt w Polsce.**
> 127 schronisk · 16 województw · CC-BY 4.0

[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Data: CC-BY 4.0](https://img.shields.io/badge/data-CC--BY%204.0-orange.svg)](LICENSE-DATA)
[![127 shelters](https://img.shields.io/badge/dataset-127%20shelters-green.svg)](https://otwarteschroniska.org.pl/api/v1/manifest.json)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro%206-FF5D01.svg)](https://astro.build)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-000000.svg)](https://vercel.com)
[![Schema.org Dataset](https://img.shields.io/badge/Schema.org-Dataset-4285F4.svg)](https://schema.org/Dataset)

🌐 **Live:** https://otwarteschroniska.org.pl
📊 **Endpoints:** [`/api/v1/shelters.json`](https://otwarteschroniska.org.pl/api/v1/shelters.json) · [`/api/v1/schema.json`](https://otwarteschroniska.org.pl/api/v1/schema.json)
📜 **License:** CC-BY 4.0 (data) + MIT (code)

## Why this exists

Polskie schroniska dla zwierząt walczą o widoczność. Nie ma centralnej bazy ich danych, każde schronisko żyje na własnej (często niewidocznej) stronie, w przepisach gminnych, w dokumentach WIW.

Ten dataset to próba zmiany. **Otwarte API, darmowe, bez kont, bez kluczy.** Każdy programista może w 5 minut zbudować apkę pomagającą znaleźć schronisko w swojej okolicy. Każdy dziennikarz może zacytować dane bez pytania nikogo o pozwolenie. Każdy aktywista może analizować pokrycie regionów i kierować pomoc tam, gdzie najbardziej potrzeba.

**Im więcej osób tych danych użyje, tym więcej psów i kotów znajdzie dom.**

## Quickstart (4 sposoby)

### curl
```bash
curl https://otwarteschroniska.org.pl/api/v1/shelters.json | jq '.[] | select(.miasto == "Wrocław")'
```

### JavaScript (browser/Node 18+)
```js
const r = await fetch('https://otwarteschroniska.org.pl/api/v1/shelters.json');
const shelters = await r.json();
console.log(`${shelters.length} schronisk`);
```

### Python
```python
import requests
shelters = requests.get('https://otwarteschroniska.org.pl/api/v1/shelters.json').json()
print(f"{len(shelters)} schronisk")
```

### Node.js
```js
const r = await fetch('https://otwarteschroniska.org.pl/api/v1/shelters.json');
const data = await r.json();
const byWoj = data.reduce((acc, s) => { acc[s.wojewodztwo] = (acc[s.wojewodztwo] || 0) + 1; return acc; }, {});
console.table(byWoj);
```

## Endpoints

| URL | Co zwraca |
|---|---|
| `/api/v1/manifest.json` | Metadata + coverage stats |
| `/api/v1/shelters.json` | Wszystkie 127 schronisk |
| `/api/v1/shelters/{wojewodztwo}.json` | Filter per województwo |
| `/api/v1/shelters/by-id/{id}.json` | Pojedyncze schronisko per stable ID |
| `/api/v1/schema.json` | JSON Schema z EN docs |
| `/api/v1/types.d.ts` | TypeScript types z JSDoc EN |

CORS: `Access-Control-Allow-Origin: *`. Cache-Control: `public, max-age=3600, stale-while-revalidate=86400`.

## Showcase

**Pierwsza aplikacja korzystająca z API:** [ZatrzymajZegar.pl/schroniska/](https://www.zatrzymajzegar.pl/schroniska/), non-profit platforma adopcyjna.

## Documentation

📚 https://otwarteschroniska.org.pl/docs/

- [Schema danych](https://otwarteschroniska.org.pl/docs/schema/)
- [Data Quality Score](https://otwarteschroniska.org.pl/docs/quality/)
- [Changelog](https://otwarteschroniska.org.pl/docs/changelog/)

## License

- **Code (Astro):** [MIT](LICENSE)
- **Data (master.json):** [CC-BY 4.0](LICENSE-DATA), attribution required (link to `otwarteschroniska.org.pl`)

## Contributing

Patrz [CONTRIBUTING.md](CONTRIBUTING.md), zgłaszanie korekt, opt-out RODO, dodawanie schronisk.

## Maintainer

Lech Rudnicki · `kontakt@otwarteschroniska.org.pl`

Non-profit project. Built and maintained as side initiative. For animal shelters, not for profit. Patches, corrections, and good ideas welcome.
