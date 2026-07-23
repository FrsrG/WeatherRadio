const CACHE_NAME = 'weatheradio-v1';
const STATIC_ASSETS = [
    './',
    'index.html',
    'style.css',
    'app.js'
];

// Install Event: Cache Static Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event: Cleanup Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Cache-First for Code / Network-First for Weather API
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Network-First Strategy for Live Weather RSS & API calls
    if (url.includes('weather.gc.ca') || url.includes('allorigins')) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache-First Strategy for Static UI Assets
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
        );
    }
});