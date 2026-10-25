#!/bin/bash
# Publish the website to Cloudflare from a clean copy of origin/main, so unfinished
# local work (stashes, untracked pictures) never goes live with it. Used by release.sh.
# After the deploy it checks the live site and rolls back by itself if anything is broken.
set -e
SITE="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$SITE/../.cf-deploy-build"
cd "$SITE"
PREV=$(npx wrangler deployments list 2>/dev/null | grep -o '(100%) [0-9a-f-]*' | tail -1 | cut -d' ' -f2)
git fetch -q origin main
git worktree remove --force "$TMP" >/dev/null 2>&1 || rm -rf "$TMP"
git worktree prune
git worktree add -q --detach "$TMP" origin/main
trap 'cd "$SITE"; git worktree remove --force "$TMP" >/dev/null 2>&1 || true' EXIT
cd "$TMP"
npm ci --no-audit --no-fund --loglevel=error >/dev/null
npx opennextjs-cloudflare build >/dev/null
npx wrangler deploy >/dev/null 2>&1

ok() { [ "$(curl -s -o /dev/null -w '%{http_code}' "$1")" = "$2" ]; }
sleep 5
if ok https://mybloomboard.app/ 200 && ok https://mybloomboard.app/nope-404-check 404 \
   && ok "https://mybloomboard.app/api/checkout?plan=team&yearly=1&quantity=3" 303; then
  echo "✔ Website live on Cloudflare"
else
  echo "❌ Website check failed after deploy; rolling back to ${PREV}"
  [ -n "$PREV" ] && npx wrangler rollback "$PREV" -y -m "auto rollback: failed live check" >/dev/null 2>&1
  exit 1
fi
