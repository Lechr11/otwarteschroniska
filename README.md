# otwarteschroniska.org.pl

> **Pierwsze otwarte API schronisk dla zwierząt w Polsce.**
> 127 schronisk · 16 województw · CC-BY 4.0

🌐 **Live:** https://otwarteschroniska.org.pl
📊 **Endpoints:** [`/api/v1/shelters.json`](https://otwarteschroniska.org.pl/api/v1/shelters.json) · [`/api/v1/schema.json`](https://otwarteschroniska.org.pl/api/v1/schema.json)
📜 **License:** CC-BY 4.0 (data) + MIT (code)

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

**Pierwsza aplikacja korzystająca z API:** [ZatrzymajZegar.pl/schroniska/](https://www.zatrzymajzegar.pl/schroniska/) — non-profit platforma adopcyjna.

## Documentation

📚 https://otwarteschroniska.org.pl/docs/

- [Schema danych](https://otwarteschroniska.org.pl/docs/schema/)
- [Data Quality Score](https://otwarteschroniska.org.pl/docs/quality/)
- [Changelog](https://otwarteschroniska.org.pl/docs/changelog/)

## License

- **Code (Astro):** [MIT](LICENSE)
- **Data (master.json):** [CC-BY 4.0](LICENSE-DATA) — attribution required (link to `otwarteschroniska.org.pl`)

## Contributing

Patrz [CONTRIBUTING.md](CONTRIBUTING.md) — zgłaszanie korekt, opt-out RODO, dodawanie schronisk.

## Owner

Lech Rudnicki · `kontakt@otwarteschroniska.org.pl`
