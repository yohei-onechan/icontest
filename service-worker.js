
var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
var day = today.getDate();
const CACHE_NAME = `${year}-${month}-${day}`;
const CACHE_FILE = [
  './img/icon.png',
  './img/icon-128.png',
  './img/icon-256.png',
];

self.addEventListener("install", (event) => {
  console.log("Service worker install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILE);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activate");
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(cacheName) {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log("Service worker fetch");
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      
      // リクエストのクローンを作成する
      let ReqClone = event.request.clone();
      return fetch(ReqClone).then(function(response) {
        if (!response ||
            response.status !== 200 ||
            response.type !== 'basic') {
          return response;
        }
        
        // レスポンスのクローンを作成する
        let ResClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, ResClone);
        });
        return response;
      });
    })
  );
});
