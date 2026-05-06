const CACHE_NAME = "missions-declic-v8";
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
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(APP_SHELL.map(async (url) => {
        try {
          const request = new Request(url, { cache: "reload" });
          const response = await fetch(request);
          if (response && response.ok) {
            await cache.put(request, response.clone());
          }
        } catch (error) {
          // ignore individual preload failures
        }
      }));
    })
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
  const isCriticalAsset = request.destination === "document" || request.destination === "script" || request.destination === "style";

  event.respondWith(
    (async () => {
      if (isCriticalAsset || isNavigationRequest) {
        try {
          const networkResponse = await fetch(request);
          if (isSameOrigin && networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          const fallback = await caches.match(request);
          if (fallback) return fallback;
          if (isNavigationRequest) return caches.match("./missions-declic.html");
          throw error;
        }
      }

      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;
      const networkResponse = await fetch(request);
      if (isSameOrigin && networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
