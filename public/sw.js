// Pharmacards service worker. Plain JS, no dependencies.
// The app registers /sw.js?v=<app version>, so each release installs a fresh cache and prunes the old one.
const CACHE_VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE_NAME = `pharmacards-${CACHE_VERSION}`;
const ROUTES = ["/", "/browse", "/stats", "/bookmarks", "/settings", "/admin", "/study"];
const PRECACHE_URLS = [...ROUTES, "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // "reload" bypasses the HTTP cache so every route's HTML matches the new build.
      .then((cache) => cache.addAll(PRECACHE_URLS.map((u) => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting()),
  );
});

/** Drop /_next/static entries that no precached page references (chunks from older builds). */
async function pruneStatic() {
  const cache = await caches.open(CACHE_NAME);
  const used = new Set();
  for (const route of ROUTES) {
    const res = await cache.match(route);
    if (!res) return; // shortcut: if a page is missing we cannot tell what is used, so prune nothing
    for (const m of (await res.text()).matchAll(/\/_next\/static\/[^"'\s)\]]+/g)) used.add(m[0]);
  }
  // shortcut: lazily imported chunks not named in any page HTML are pruned too; they re-download online.
  for (const req of await cache.keys()) {
    const path = new URL(req.url).pathname;
    if (path.startsWith("/_next/static/") && !used.has(path)) await cache.delete(req);
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key.startsWith("pharmacards-") && key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(pruneStatic)
      .catch(() => {})
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/") || /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isStaticAsset(url)) {
    // Cache-first: hashed Next.js bundles and images never change for a given URL.
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      }),
    );
    return;
  }

  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    // Network-first for pages, falling back to the cached copy (or the cached "/" shell) offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }).then((cached) => cached || caches.match("/"))),
    );
  }
});
