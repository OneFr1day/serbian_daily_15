const APP_VERSION = "1.3.0";
const CACHE_NAME = `serbian-daily-15-${APP_VERSION}`;
const BASE_PATH = new URL(self.registration.scope).pathname;
const asset = (path) => `${BASE_PATH}${path}`.replace(/\/\/+/g, "/");
const APP_SHELL = [asset(""), asset("index.html"), asset("manifest.webmanifest"), asset("icon.svg"), asset("version.json"), asset("icon.svg"), asset("icon-192.png"), asset("icon-512.png"), asset("apple-touch-icon.png")];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => undefined)
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : undefined)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.pathname.endsWith("/version.json")) {
    event.respondWith(fetch(request, { cache: "no-store" }).catch(() => caches.match(request)));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(asset("index.html"), copy));
          return response;
        })
        .catch(() => caches.match(asset("index.html")))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
