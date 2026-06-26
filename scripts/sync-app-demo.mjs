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
const BOOT_SCRIPT =
  '<script src="demo-seed.js?v=29"></script>\n  <script src="demo-boot.js?v=29"></script>';

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

  let patched = html.replace(
    /<head>/i,
    `<head>\n  ${PATCH_MARKER}\n  ${BOOT_SCRIPT}`
  );

  patched = patched.replace(/<title>BloomBooard<\/title>/i, '<title>BloomBoard — Demo</title>');

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
