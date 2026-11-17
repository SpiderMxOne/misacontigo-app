const CACHE_NAME = 'misacontigo-v2.8-cache';
const ASSETS = [
  'app.html',
  'app.js',
  'style.css',
  'index.html',
  'assets/guias_estacionales_mexico.json',
  'assets/oraciones_catolicas_latinoamerica_expandido.json',
  'assets/santos_mexicanos.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
