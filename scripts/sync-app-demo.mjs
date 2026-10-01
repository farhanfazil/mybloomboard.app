#!/usr/bin/env node
/**
 * Sync BloomBoard desktop app into public/bloomboard-demo for the browser demo.
 * Run: npm run sync-demo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'html-minifier-terser';
import { minify as minifyJs } from 'terser';

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
  ...['demo-supabase.js', 'demo-seed.js', 'demo-boot.js', 'demo-mail.js', 'demo-convert.js', 'demo-sim.js'].map(
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
  // The app loads supabase-js from vendor/ (older builds used the CDN); either way
  // it must not load here or it would replace the fake client.
  replaceOnce(
    /\s*<!--[^>]*supabase-js[^>]*-->\s*<script src="vendor\/supabase\.js"><\/script>|\s*<script src="(?:vendor\/supabase\.js|https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\/dist\/umd\/supabase\.js)"><\/script>/,
    '',
    'Supabase <script>'
  );
  // Root-relative app files (the first-open welcome's logo) live beside the page here.
  patched = patched.replace(/src="\/icon\.iconset\//g, 'src="icon.iconset/');
  // The app's own feature scripts (vendor/bb-*.js) are copied next to the page;
  // a version stamp makes returning visitors fetch the new copies.
  patched = patched.replace(/src="vendor\/(bb-[\w-]+\.js)"/g, `src="vendor/$1?v=${VERSION}"`);
  // Calls are simulated in the demo; the LiveKit bundle lives in node_modules and would 404.
  replaceOnce(
    /\s*<script src="node_modules\/livekit-client\/dist\/livekit-client\.umd\.js"><\/script>/,
    '',
    'LiveKit <script>'
  );

  // App bug (v1.2.42): loadTasks() rebuilds each task from a fixed list of fields
  // and leaves out `col`, so a task in a custom board column falls back to its main
  // column on every reload. Keep `col` in the demo's copy until the app has it.
  const loadTasksOwner = /(\n    ownerId: t\.ownerId \|\| null,\n)(  \}\)\);\n\}\nfunction saveTasks\(\))/;
  if (loadTasksOwner.test(patched) && !/col: t\.col/.test(patched)) {
    patched = patched.replace(loadTasksOwner, '$1    col: t.col || undefined,\n$2');
  }

  // App bug (v1.2.42): the team sync cleans every key ending in "color" as a CSS
  // colour, so a board's bgColor swatch id ("g-plum") turns grey after a sync.
  // Let swatch ids through in the demo's copy.
  const colorClean = "else if (/color$/i.test(k))       x = x ? bbCssColor(x) : x;";
  if (patched.includes(colorClean)) {
    patched = patched.replace(colorClean, "else if (/color$/i.test(k))       x = x && !/^g-[a-z-]+$/.test(x) ? bbCssColor(x) : x;");
  }

  // "Type your tasks" demo: two example lines, then start over (the app types three).
  if (patched.includes('        if (count >= 3) {')) patched = patched.replace('        if (count >= 3) {', '        if (count >= 2) {');
  // No login form in the demo. Browsers fill a visitor's saved email into the first
  // text box (the top bar search) of any page with password or username fields,
  // and Chrome shows it before the page's own code can see it. Nobody signs in
  // here, so those fields become plain text (drawn as dots by demo-boot.js).
  patched = patched
    .replace(/(<input\b[^>]*?)\btype="password"/g, '$1type="text" data-bb-pw="1"')
    .replace(/autocomplete="(current-password|new-password|username|email|given-name)"/g, 'autocomplete="off"');

  return scrubPersonalData(patched);
}

/**
 * The desktop app carries its owner's name, location and client projects in a
 * few visible strings. The public demo must show only fictional data (persona:
 * Sam Rivera). The app's storage keys (`farhan-dash-tasks`, `farhan_…`) are renamed
 * to `bbd-…` too, so no name shows even in page source or browser storage; the demo's
 * own scripts (demo-*.js) use the same `bbd-` names.
 */
function scrubPersonalData(html) {
  const swaps = [
    [/Farhan Fazil/g, 'Sam Rivera'],
    [/\bFarhan\b/g, 'Sam'],
    [/FARHAN'S/g, "SAM'S"],
    [/farhan_fazil/g, 'sam_rivera'],
    [/farhan([-_])/g, 'bbd$1'],
    [/https:\/\/github\.com\/farhanfazil\/bloombooard-releases\/releases\/latest\/download\/BloomBoard-Installer\.dmg/g, '/download/mac'],
    [/ · Sharjah, UAE/g, ''],
    // Internal project ids / legacy migration keys — never shown, but readable in page source.
    [/\bproj-stctv\b/g, 'proj-web'],
    [/\bproj-jawwy\b/g, 'proj-mobile'],
    [/\bproj-serieA\b/g, 'proj-campaign'],
    [/'stctv'/g, "'web'"],
    [/'jawwy'/g, "'mobile'"],
    [/'serieA'/g, "'campaign'"],
    // App fallback projects, used only when no project list exists.
    [/name:'stc tv \/ U21', colorHex:'#4d9fff', emoji:'📺'/g, "name:'Website Relaunch', colorHex:'#4d9fff', emoji:'🌐'"],
    [/name:'Jawwy TV',      colorHex:'#ff9f0a', emoji:'📡'/g, "name:'Mobile App v2', colorHex:'#ff9f0a', emoji:'📱'"],
    [/name:'Serie A',       colorHex:'#a78bfa', emoji:'⚽'/g, "name:'Spring Campaign', colorHex:'#a78bfa', emoji:'🌸'"],
  ];
  let out = html;
  for (const [pattern, replacement] of swaps) {
    const next = out.replace(pattern, replacement);
    if (next === out) console.warn(`Scrub pattern not found (app text changed?): ${pattern}`);
    out = next;
  }
  const leftovers = out.match(/Farhan|Fazil|Sharjah|stc ?tv|Jawwy|Khaleeji|Intigral|Serie ?A/gi) || [];
  if (leftovers.length) console.warn('Possible personal data left in demo:', [...new Set(leftovers)].join(', '));
  return out;
}

/**
 * The demo is the app's whole front end, served publicly. Strip every comment
 * and shorten local names so it is much harder to lift. Top-level names are
 * kept: inline handlers (onclick="openBoards()") call them by name.
 */
async function minifyForWeb(html) {
  return minify(html, {
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true,
    minifyJS: { compress: false, mangle: { toplevel: false }, format: { comments: false } },
  });
}

/** Same treatment for the app's separate feature scripts. */
async function minifyScript(code) {
  const out = await minifyJs(code, { compress: false, mangle: { toplevel: false }, format: { comments: false } });
  return out.code ?? code;
}

/** Names in a feature script, storage keys included (see scrubPersonalData). */
function scrubScript(code) {
  return code
    .replace(/Farhan Fazil/g, 'Sam Rivera')
    .replace(/\bFarhan\b/g, 'Sam')
    .replace(/farhan([-_])/g, 'bbd$1')
    .replace(/https:\/\/github\.com\/farhanfazil\/[^'"`\s)]*/g, '/download/mac');
}

async function main() {
  const indexSrc = path.join(APP_SOURCE, 'index.html');
  const avatarsSrc = path.join(APP_SOURCE, 'avatars');

  if (!fs.existsSync(indexSrc)) {
    console.error('App index.html not found at:', indexSrc);
    console.error('Set BB_APP_SOURCE to your DailyDashboardApp folder.');
    process.exit(1);
  }

  ensureDir(OUT);

  const html = fs.readFileSync(indexSrc, 'utf8');
  const patched = patchIndexHtml(html);
  const small = process.env.BB_DEMO_READABLE ? patched : await minifyForWeb(patched);
  fs.writeFileSync(path.join(OUT, 'index.html'), small, 'utf8');
  console.log(
    'Wrote public/bloomboard-demo/index.html (' + Math.round(small.length / 1024) + ' KB' +
      (small === patched ? ', readable' : ', minified from ' + Math.round(patched.length / 1024) + ' KB') + ')'
  );

  const avatarsOut = path.join(OUT, 'avatars');
  if (fs.existsSync(avatarsSrc)) {
    copyRecursive(avatarsSrc, avatarsOut);
    console.log('Copied avatars/');
  } else {
    console.warn('No avatars folder at', avatarsSrc);
  }

  // 3D emoji for the picker and reaction row (Fluent Emoji, MIT).
  const assetsSrc = path.join(APP_SOURCE, 'assets');
  if (fs.existsSync(assetsSrc)) {
    copyRecursive(assetsSrc, path.join(OUT, 'assets'));
    console.log('Copied assets/');
  }

  // The app icon the top bar shows beside "BloomBoard".
  const iconSrc = path.join(APP_SOURCE, 'icon.iconset', 'icon_512x512.png');
  if (fs.existsSync(iconSrc)) {
    ensureDir(path.join(OUT, 'icon.iconset'));
    fs.copyFileSync(iconSrc, path.join(OUT, 'icon.iconset', 'icon_512x512.png'));
  }

  // The app's feature scripts. supabase.js stays out: demo-supabase.js is the backend here.
  const vendorSrc = path.join(APP_SOURCE, 'vendor');
  if (fs.existsSync(vendorSrc)) {
    const vendorOut = path.join(OUT, 'vendor');
    ensureDir(vendorOut);
    const names = fs.readdirSync(vendorSrc).filter((n) => /\.js$/.test(n) && n !== 'supabase.js');
    for (const name of names) {
      const code = scrubScript(fs.readFileSync(path.join(vendorSrc, name), 'utf8'));
      const out = process.env.BB_DEMO_READABLE ? code : await minifyScript(code);
      fs.writeFileSync(path.join(vendorOut, name), out, 'utf8');
    }
    // A script the app no longer loads should not linger in the demo.
    for (const name of fs.readdirSync(vendorOut)) {
      if (!names.includes(name)) fs.rmSync(path.join(vendorOut, name));
    }
    console.log('Copied vendor/ (' + names.join(', ') + ')');
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
