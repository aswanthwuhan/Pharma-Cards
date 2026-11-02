'use strict';
// Pharmacards desktop shell.
//
// Serves the Next.js static export (out/) through a privileged custom scheme,
// app://pharmacards, so the app gets one stable origin and IndexedDB (Dexie)
// keeps progress across launches.
//
// Requires out/ to exist: run `npm run desktop:build` (next build) first.
// Set ELECTRON_DEV_URL (e.g. http://localhost:3000) to load a dev server instead.
// Pass --smoke to load the app, print "SMOKE OK <title>" and exit (used by CI).

const path = require('node:path');
const fs = require('node:fs');
const { app, BrowserWindow, protocol, shell, Menu } = require('electron');

const SCHEME = 'app';
const APP_URL = `${SCHEME}://pharmacards/`;
const OUT_DIR = path.join(__dirname, '..', 'out');
const DEV_URL = process.env.ELECTRON_DEV_URL || '';
const SMOKE = process.argv.includes('--smoke');

let devOrigin = '';
if (DEV_URL) {
  try {
    devOrigin = new URL(DEV_URL).origin;
  } catch {
    devOrigin = '';
  }
}

// Must run before the app is ready.
protocol.registerSchemesAsPrivileged([
  {
    scheme: SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
  },
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
};

// Maps a URL path to a file inside out/. Tries the exact file, then "<path>.html"
// (so /study finds study.html), then "<path>/index.html". Query strings never
// reach here (only the pathname is passed). Anything resolving outside out/ is refused.
async function resolveOutFile(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;

  const clean = decoded.replace(/^\/+/, '').replace(/\/+$/, '');
  const candidates =
    clean === ''
      ? ['index.html']
      : [clean, `${clean}.html`, path.posix.join(clean, 'index.html')];
  // Segment prefetches ask for "__next.study.__PAGE__.txt" (path joined with dots), but the
  // export writes it as "__next.study/__PAGE__.txt". Try that layout too.
  const seg = /(^|\/)__next\.(.+)\.txt$/.exec(clean);
  if (seg) candidates.push(clean.slice(0, seg.index + seg[1].length) + '__next.' + seg[2].replace(/\./g, '/') + '.txt');

  for (const rel of candidates) {
    const full = path.resolve(OUT_DIR, rel);
    if (full !== OUT_DIR && !full.startsWith(OUT_DIR + path.sep)) continue;
    try {
      const stat = await fs.promises.stat(full);
      if (stat.isFile()) return full;
    } catch {
      // not found, try next candidate
    }
  }
  return null;
}

function isInternalUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === `${SCHEME}:`) return true;
    return Boolean(devOrigin) && parsed.origin === devOrigin;
  } catch {
    return false;
  }
}

function openExternal(url) {
  try {
    const parsed = new URL(url);
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      shell.openExternal(parsed.toString());
    }
  } catch {
    // ignore malformed URLs
  }
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 380,
    minHeight: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const wc = mainWindow.webContents;

  wc.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });

  wc.on('will-navigate', (event, url) => {
    if (!isInternalUrl(url)) {
      event.preventDefault();
      openExternal(url);
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (SMOKE) {
    const smokeTimer = setTimeout(() => {
      console.error('SMOKE FAIL timeout waiting for did-finish-load');
      app.exit(1);
    }, 10000);
    wc.once('did-finish-load', () => {
      clearTimeout(smokeTimer);
      console.log(`SMOKE OK ${wc.getTitle()}`);
      app.exit(0);
    });
    wc.on('did-fail-load', (_event, code, desc, url, isMainFrame) => {
      if (!isMainFrame) return;
      clearTimeout(smokeTimer);
      console.error(`SMOKE FAIL ${code} ${desc} ${url}`);
      app.exit(1);
    });
  }

  mainWindow.loadURL(DEV_URL || APP_URL);
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);

    protocol.handle(SCHEME, async (request) => {
      const { pathname } = new URL(request.url);
      const file = await resolveOutFile(pathname);
      if (!file) {
        return new Response('Not found', {
          status: 404,
          headers: { 'content-type': 'text/plain; charset=utf-8' },
        });
      }
      const body = await fs.promises.readFile(file);
      const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
      return new Response(body, { headers: { 'content-type': type } });
    });

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
