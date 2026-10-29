#!/bin/bash
# Publish the website to Cloudflare from a clean copy of origin/main, so unfinished
# local work (stashes, untracked pictures) never goes live with it. Used by release.sh.
# After the deploy it checks the live site and rolls back by itself if anything is broken.
set -e
SITE="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$SITE/../.cf-deploy-build"
cd "$SITE"
PREV=$(npx wrangler deployments list 2>/dev/null | grep -o '(100%) [0-9a-f-]*' | tail -1 | cut -d' ' -f2)
# one deploy at a time (a release may be deploying the demo in the background)
LOCK="$TMP.lock"; n=0
until mkdir "$LOCK" 2>/dev/null; do n=$((n+1)); [ $n -gt 180 ] && { echo "❌ Another website deploy is still running"; exit 1; }; sleep 5; done
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT
git fetch -q origin main
# The build copy is kept between deploys (with its packages and Next build cache) and reset to origin/main,
# so a small change does not reinstall everything. Packages are reinstalled only when package-lock.json changed.
if [ -f "$TMP/.git" ] && git -C "$TMP" checkout -q --detach --force origin/main 2>/dev/null; then
  git -C "$TMP" clean -qfdx -e node_modules -e .next
else
  git worktree remove --force "$TMP" >/dev/null 2>&1 || rm -rf "$TMP"
  git worktree prune
  git worktree add -q --detach "$TMP" origin/main
fi
cd "$TMP"
LOCKHASH=$(shasum package-lock.json | cut -c1-40)
if [ "$(cat node_modules/.bb-lockhash 2>/dev/null)" != "$LOCKHASH" ]; then
  npm ci --no-audit --no-fund --loglevel=error >/dev/null
  echo "$LOCKHASH" > node_modules/.bb-lockhash
fi
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
