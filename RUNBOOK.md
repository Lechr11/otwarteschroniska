# RUNBOOK — otwarteschroniska.org.pl operations

> Procedury operacyjne dla Lecha (operator) i future Claude Code sessions.

## 1. Update kwartalny datasetu (Flow 1)

Standardowa procedura po re-scrape w `projects/schroniska-baza`:

```bash
cd /Users/lech/aidevs/projects/schroniska-baza
uv run python -m scraper.main scrape-all          # ~6h, ~$4
# Manual review audit_sample.html (Layer 4 quality gate)
```

Następnie publish:

```bash
cd /Users/lech/aidevs/apps/otwarteschroniska
./scripts/publish.sh
```

Skrypt wykonuje: cp master.json + commit + push + Vercel auto-deploy + verify post-deploy + (opcjonalnie) trigger ZZ rebuild via Deploy Hook.

## 2. Manual override pojedynczego rekordu

Gdy mamy świeższe dane od opiekuna schroniska niż scraper:

1. Edit `src/data/master.json` ręcznie (znajdź shelter po id, update fields)
2. `git add src/data/master.json && git commit -m "data: update [shelter id] from operator"`
3. `git push` → Vercel auto-deploy
4. Trigger ZZ redeploy (patrz pkt 7)

W przyszłości (>5 schronisk wymaga override): zbuduj `manual_overrides.json` mechanism w `schroniska-baza`.

## 3. RODO opt-out workflow (Flow 3)

Gdy schronisko emailuje że chce opt-out:

1. Verify uprawnienie (matching admin email lub dokument)
2. SLA: ≤5 dni roboczych
3. Edit `src/data/master.json`:
   - Opcja A: dodaj `"opt_out": true` do rekordu (zachowuje historię)
   - Opcja B: usuń rekord całkowicie
4. `git commit + push` → API zaktualizowane
5. Trigger ZZ redeploy

## 4. Build failure debugging

Jeśli Vercel deploy pada:

1. Check Vercel dashboard → Deployments → ostatni failed → Build Logs
2. Najczęstsze przyczyny:
   - **Zod schema parse failure** → master.json ma invalid record. Run `npm run build` lokalnie, fix master.json.
   - **Astro build error** → check error message, often missing import lub type mismatch
3. Vercel keeps stary build live → zero downtime
4. Po fix: `git commit + push` → next build próbuje od nowa

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

Skrót:
1. Lech: rejestracja domeny w home.pl/NetArt
2. Vercel: dodaj custom domain `otwarteschroniska.org.pl`
3. ImprovMX: setup catch-all → lech.rudnicki@prawnymarketing.pl
4. Update `astro.config.mjs` site URL + snippety w `src/components/*` (search & replace `vercel.app` → `org.pl`)
5. Verify production: `curl https://otwarteschroniska.org.pl/api/v1/manifest.json`

## 7. Trigger ZZ redeploy po update danych

Po publish.sh: ZZ Vercel rebuild musi być triggered manualnie (ZZ nic nie pushuje przy data update).

```bash
# Vercel Deploy Hook URL (ustawiony w Vercel ZZ project → Settings → Deploy Hooks)
# Hook URL przechowywany lokalnie w .env.local
curl -X POST "$ZZ_DEPLOY_HOOK"
```

publish.sh automatyzuje to (jeśli ZZ_DEPLOY_HOOK env var jest ustawiony).

## Kontakt

Lech Rudnicki · `kontakt@otwarteschroniska.org.pl`
