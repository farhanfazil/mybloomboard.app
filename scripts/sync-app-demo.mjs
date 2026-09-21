#!/usr/bin/env node
/**
 * Sync BloomBoard desktop app into public/bloomboard-demo for the browser demo.
 * Run: npm run sync-demo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'bloomboard-demo');

const DEFAULT_APP =
  '/Users/farhan_f/Desktop/Daily Dashboard/DailyDashboardApp';
const APP_SOURCE = process.env.BB_APP_SOURCE || DEFAULT_APP;

const PATCH_MARKER = '<!-- bb-web-demo-patched -->';
const VERSION = Date.now().toString(36);
// Order matters: the fake Supabase must exist before the app calls
// supabase.createClient, the seed must run before demo-boot wipes/reseeds, and
// the simulation registers its presence defaults before the app subscribes.
const APP_VERSION = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(APP_SOURCE, 'package.json'), 'utf8')).version || '';
  } catch {
    return '';
  }
})();
const BOOT_SCRIPT = [
  `<script>window.BB_APP_VERSION = ${JSON.stringify(APP_VERSION)};</script>`,
  ...['demo-supabase.js', 'demo-seed.js', 'demo-boot.js', 'demo-sim.js'].map(
    (f) => `<script src="${f}?v=${VERSION}"></script>`
  ),
].join('\n  ');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function listPngFiles(dir, base = dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      out.push(...listPngFiles(full, base));
    } else if (/\.png$/i.test(name)) {
      out.push(name);
    }
  }
  return out.sort();
}

function buildAvatarManifest(avatarsRoot) {
  const manifest = {};
  if (!fs.existsSync(avatarsRoot)) return manifest;

  for (const name of fs.readdirSync(avatarsRoot)) {
    const full = path.join(avatarsRoot, name);
    if (!fs.statSync(full).isDirectory()) continue;
    const files = listPngFiles(full);
    if (files.length) manifest[name] = files;
  }
  return manifest;
}

function patchIndexHtml(html) {
  if (html.includes(PATCH_MARKER)) return html;

  let patched = html;
  const replaceOnce = (pattern, replacement, label) => {
    const next = patched.replace(pattern, replacement);
    if (next === patched) {
      throw new Error(`Anchor not found: ${label}. The app's <head> changed — update scripts/sync-app-demo.mjs.`);
    }
    patched = next;
  };

  replaceOnce(/<head>/i, `<head>\n  ${PATCH_MARKER}\n  ${BOOT_SCRIPT}`, '<head>');
  replaceOnce(/<title>[^<]*<\/title>/i, '<title>BloomBoard — Demo</title>', '<title>');
  // Electron-only policy; in a browser iframe it only gets in the way.
  replaceOnce(/\s*<meta http-equiv="Content-Security-Policy"[^>]*>/i, '', 'CSP <meta>');
  // demo-supabase.js provides window.supabase; the real library would overwrite it.
  replaceOnce(
    /\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\/dist\/umd\/supabase\.js"><\/script>/,
    '',
    'Supabase CDN <script>'
  );
  // Calls are simulated in the demo; the LiveKit bundle lives in node_modules and would 404.
  replaceOnce(
    /\s*<script src="node_modules\/livekit-client\/dist\/livekit-client\.umd\.js"><\/script>/,
    '',
    'LiveKit <script>'
  );

  return patched;
}

function main() {
  const indexSrc = path.join(APP_SOURCE, 'index.html');
  const avatarsSrc = path.join(APP_SOURCE, 'avatars');

  if (!fs.existsSync(indexSrc)) {
    console.error('App index.html not found at:', indexSrc);
    console.error('Set BB_APP_SOURCE to your DailyDashboardApp folder.');
    process.exit(1);
  }

  ensureDir(OUT);

  const html = fs.readFileSync(indexSrc, 'utf8');
  fs.writeFileSync(path.join(OUT, 'index.html'), patchIndexHtml(html), 'utf8');
  console.log('Wrote public/bloomboard-demo/index.html');

  const avatarsOut = path.join(OUT, 'avatars');
  if (fs.existsSync(avatarsSrc)) {
    copyRecursive(avatarsSrc, avatarsOut);
    console.log('Copied avatars/');
  } else {
    console.warn('No avatars folder at', avatarsSrc);
  }

  const manifest = buildAvatarManifest(avatarsOut);
  fs.writeFileSync(
    path.join(OUT, 'avatar-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
  console.log(
    'Wrote avatar-manifest.json (' +
      Object.keys(manifest).length +
      ' folders)'
  );

  const bootSrc = path.join(OUT, 'demo-boot.js');
  if (!fs.existsSync(bootSrc)) {
    console.warn('demo-boot.js missing — create public/bloomboard-demo/demo-boot.js');
  }

  console.log('Done. Demo bundle ready at public/bloomboard-demo/');
}

main();
