const CACHE_NAME = "missions-declic-v5";
const APP_SHELL = [
  "./",
  "./index.html",
  "./missions-declic.html",
  "./missions-declic.css",
  "./missions-declic.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const { request } = event;
  const isNavigationRequest = request.mode === "navigate";
  const isSameOrigin = new URL(request.url).origin === self.location.origin;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (isSameOrigin && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });

      if (cachedResponse) {
        event.waitUntil(networkFetch.catch(() => null));
        return cachedResponse;
      }

      return networkFetch.catch(() => {
        if (isNavigationRequest) return caches.match("./missions-declic.html");
        return caches.match(request);
      });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
