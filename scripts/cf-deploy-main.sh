#!/bin/bash
# Publish the website to Cloudflare from a clean copy of origin/main, so unfinished
# local work (stashes, untracked pictures) never goes live with it. Used by release.sh.
set -e
SITE="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$SITE/../.cf-deploy-build"; rm -rf "$TMP"
cd "$SITE"
git fetch -q origin main
git worktree add -q --detach "$TMP" origin/main
trap 'cd "$SITE"; git worktree remove --force "$TMP" >/dev/null 2>&1 || true' EXIT
ln -s "$SITE/node_modules" "$TMP/node_modules"
cd "$TMP"
npx opennextjs-cloudflare build >/dev/null
npx wrangler deploy >/dev/null 2>&1
