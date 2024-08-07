const cacheName = "offlineCacheV1";

const offlinePages = [
  "/offline.html",
  // other page which you wanted to caches
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        // Using cacheName for opening cache
        return cache.addAll(offlinePages); // Cache multiple pages
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            // Checking if cache name is not 'v1'
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch((error) => {
      return caches.match(e.request).then((response) => {
        if (response) {
          return response;
        } else if (e.request.headers.get("accept").includes("text/html")) {
          // If the request is for an HTML page, return the offline page
          return caches.match("/offline.html");
        }
      });
    })
  );
});
