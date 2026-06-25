const CACHE = 'whaatachi-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.match(/\/api\//)) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        if (res.ok && res.status < 300) {
          try {
            const cloned = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, cloned)).catch(() => {});
          } catch (_) {}
        }
        return res;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('/index.html');
        return cached;
      });
      return cached || fetched;
    })
  );
});
