// High-Performance Service Worker v3.0
const CACHE_NAME = 'funding-scotland-v3';
const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v3';
const IMAGE_CACHE = 'images-v3';

// Critical assets for immediate caching (1 week TTL)
const STATIC_ASSETS = [
  '/',
  '/manifest.json'
];

// Long-term cacheable resources (1 month TTL)
const LONG_TERM_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap&subset=latin',
  'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests and API calls for performance
  if (url.origin !== location.origin || 
      url.pathname.includes('/api/') || 
      url.pathname.includes('/functions/') ||
      url.hostname.includes('facebook.com') ||
      url.hostname.includes('analytics')) return;

  // Cache strategy based on asset type
  if (request.destination === 'image') {
    // Images: Cache first, network fallback
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) return response;
          
          return fetch(request)
            .then((fetchResponse) => {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
              return fetchResponse;
            });
        })
    );
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS: Network first, cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // HTML/Documents: Network first, cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline form submissions here
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  }
});