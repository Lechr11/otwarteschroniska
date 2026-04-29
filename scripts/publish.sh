#!/bin/bash
# scripts/publish.sh
# Publish updated master.json from schroniska-baza to otwarteschroniska + trigger ZZ redeploy.
#
# Usage: ./scripts/publish.sh [optional commit message suffix]
#
# Steps:
#   1. cp master.json from schroniska-baza/output/ → src/data/
#   2. git commit ze standardowym messagem (data: YYYY-Qx refresh)
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

# Load .env.local jeśli istnieje
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

# Trigger ZZ rebuild (optional)
if [ -n "${ZZ_DEPLOY_HOOK:-}" ]; then
    echo "5/5 Triggering ZZ rebuild..."
    curl -X POST "$ZZ_DEPLOY_HOOK" > /dev/null 2>&1
    echo "   ✓ ZZ Vercel rebuild triggered"
else
    echo "5/5 ⚠ ZZ_DEPLOY_HOOK env var not set — manual trigger ZZ rebuild needed"
    echo "   See Vercel ZZ project → Settings → Deploy Hooks"
fi

echo ""
echo "✅ Done. Check https://www.zatrzymajzegar.pl/schroniska/ in ~2 min for fresh data."
