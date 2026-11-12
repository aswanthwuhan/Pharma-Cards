// Pharmacards service worker. Plain JS, no dependencies.
// The app registers /sw.js?v=<app version>, so each release installs a fresh cache and prunes the old one.
const CACHE_VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE_NAME = `pharmacards-${CACHE_VERSION}`;
// Base path the app is served under ("" at the root, "/Pharma-Cards" on GitHub Pages), taken from the SW scope.
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const ROUTES = ["/", "/browse", "/stats", "/bookmarks", "/settings", "/admin", "/study", "/help"].map((r) => BASE + r);
const PRECACHE_URLS = [...ROUTES, BASE + "/manifest.webmanifest"];
const STATIC_PREFIX = BASE + "/_next/static/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // "reload" bypasses the HTTP cache so every route's HTML matches the new build.
      .then((cache) =>
        cache
          .addAll(PRECACHE_URLS.map((u) => new Request(u, { cache: "reload" })))
          // The page's JS/CSS is fetched before this worker controls the page, so the fetch handler misses it; add it here.
          .then(() => referencedStatic(cache))
          .then((used) => (used ? Promise.allSettled([...used].map((u) => cache.add(u))) : undefined)),
      )
      .then(() => self.skipWaiting()),
  );
});

/** Every /_next/static URL named by the cached route HTML (install caches them), or null if a route is missing from the cache. */
async function referencedStatic(cache) {
  const used = new Set();
  for (const route of ROUTES) {
    const res = await cache.match(route);
    if (!res) return null; // shortcut: if a page is missing we cannot tell what is used, so install caches no chunks
    // The regex can capture a trailing backslash from escaped JSON in the HTML; strip it.
    for (const m of (await res.text()).matchAll(/\/_next\/static\/[^"'\s)\]]+/g)) used.add(BASE + m[0].replace(/\\+$/, ""));
  }
  return used;
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
      .catch(() => {})
      .then(() => self.clients.claim()),
  );
});

// RegisterSW.tsx posts the lazily loaded chunk URLs it saw; cache the ones this origin serves under STATIC_PREFIX.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "cache-urls" || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        event.data.urls.map(async (u) => {
          const url = new URL(u, self.location.origin);
          if (url.origin !== self.location.origin || !url.pathname.startsWith(STATIC_PREFIX)) return;
          if (!(await cache.match(url.href))) await cache.add(url.href);
        }),
      ),
    ),
  );
});

function isStaticAsset(url) {
  return url.pathname.startsWith(STATIC_PREFIX) || /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(url.pathname);
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
        .catch(() => caches.match(request, { ignoreSearch: true }).then((cached) => cached || caches.match(BASE + "/"))),
    );
  }
});
