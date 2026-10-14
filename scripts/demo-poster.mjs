#!/usr/bin/env node
/**
 * Takes a picture of the live demo's first screen (public/bloomboard-demo/poster.jpg).
 * The home page shows it the moment the page opens and fades the real demo in over
 * it once the demo has drawn, so the window is never empty while the demo loads.
 * Run after the demo changes (sync-demo runs it): npm run demo-poster
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');
const OUT = path.join(PUBLIC, 'bloomboard-demo', 'poster.jpg');
const APP_SOURCE = process.env.BB_APP_SOURCE || '/Users/farhan_f/Desktop/Daily Dashboard/DailyDashboardApp';
const ELECTRON = path.join(APP_SOURCE, 'node_modules', '.bin', 'electron');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' };

if (!fs.existsSync(ELECTRON)) {
  console.warn('demo-poster: no Electron at', ELECTRON, '(poster not updated)');
  process.exit(0);
}

/* the demo needs to be served over http, so a tiny static server for public/ */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) { res.writeHead(204); res.end(); return; }
  /* framed like on the home page, so the demo leaves out its own top bar */
  if (url.pathname === '/__poster.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!doctype html><style>html,body{margin:0;background:#171717;overflow:hidden}iframe{border:0;width:1280px;height:920px;display:block}</style>' +
      '<iframe src="/bloomboard-demo/index.html?embed=home&ws=personal,team&nostory=1"></iframe>');
    return;
  }
  const file = path.join(PUBLIC, decodeURIComponent(url.pathname));
  if (!file.startsWith(PUBLIC) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const main = path.join(os.tmpdir(), `bb-demo-poster-${process.pid}.cjs`);
fs.writeFileSync(main, `
const { app, BrowserWindow } = require('electron');
app.whenReady().then(async () => {
  const w = new BrowserWindow({ width: 1280, height: 920, useContentSize: true, x: 4000, y: 4000, show: true, webPreferences: { backgroundThrottling: false } });
  w.loadURL('http://127.0.0.1:${port}/__poster.html');
  w.webContents.sendInputEvent({ type: 'mouseMove', x: 2, y: 2 });
  /* wait until the demo has drawn its first screen (up to 20 s on a slow machine), then a moment more */
  const drawn = "(function(){try{var d=document.querySelector('iframe').contentDocument;return !!(d&&d.body&&/Team live/.test(d.body.innerText))}catch(e){return false}})()";
  for (let i = 0; i < 80 && !(await w.webContents.executeJavaScript(drawn)); i++) await new Promise((r) => setTimeout(r, 250));
  await new Promise((r) => setTimeout(r, +(process.env.BB_POSTER_WAIT || 500)));
  const img = (await w.webContents.capturePage()).resize({ width: 1280, quality: 'best' });
  require('fs').writeFileSync(${JSON.stringify(OUT)}, img.toJPEG(84));
  app.quit();
});
`);

/* run Electron asynchronously: this process keeps serving the demo meanwhile */
await new Promise((resolve) => {
  const child = spawn(ELECTRON, [main], { stdio: 'ignore' });
  const kill = setTimeout(() => child.kill('SIGKILL'), 40000);
  child.on('exit', () => { clearTimeout(kill); resolve(); });
});
server.close();
fs.rmSync(main, { force: true });
console.log(fs.existsSync(OUT) ? `demo-poster: wrote ${path.relative(process.cwd(), OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)` : 'demo-poster: no picture taken');
