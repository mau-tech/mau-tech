let CACHE_NAME = 'cache-v1',
    cacheList = [
      '/base.css',
      '/post.css',
      '/list.css',
      '/font/icon.woff2',
      '/font/athens-regular-italic-sub.woff2',
      '/font/m+r1c-light-sub.woff2',
      '/font/m+r1c-medium-sub.woff2',
      '/font/profile.jpg',
      '/ga-lite.min.js',
    ];
self.addEventListener('install', function(event) {
  event.waitUntil(
   caches.open(CACHE_NAME).then(function(cache) {
     return cache.addAll(cacheList);
   }).then(function(){
     self.skipWaiting();
   })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      });
    })
  );
});
self.addEventListener('activate', function(event) { 
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        if (self.registration.navigationPreload) {
          // Enable navigation preloads!
          await self.registration.navigationPreload.enable();
        }
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function(){
      clients.claim();
    })
  );
});