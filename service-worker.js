var cacheName = '201812210110';
var cacheFiles = [
  './assets/css/main.css',
  './assets/images/icon.png',
  './assets/js/TodoRepository.js',
  './assets/js/ui.js',  
  './assets/js/main.js',
  'index.html',
  'manifest.json',
  'service-worker.js',
  '/'
];

var cacheableApiEndpoints = [
  'https://jsonplaceholder.typicode.com/todos'
];

const fallback_empty_api_response = [];

const cache_search_options = {
    ignoreSearch: false,   // query string
    ignoreVary: true,
};

function fetchFromNetwork(request, timeout = 0){
  console.log('fetching from NETWORK: ' + request.url);
  if(navigator.onLine){ //in order to work in Safari
    return fetch(request);
  }

  return caches.open(cacheName).then(function(cache){
    return cache.match(request, cache_search_options).then(function(match){
      if(match === undefined || match == null){
        return new Response(JSON.stringify(fallback_empty_api_response), {
          headers: {'Content-Type': 'application/json'}
        });
      }
      else{
        console.log('[offline API data] fetched from cache: ' + request.url);
      }

      return match || Promise.reject('no-match');
    });
  });
}

function fetchFromCache(request){
  return caches.open(cacheName).then(function(cache){
    return cache.match(request, cache_search_options).then(function(match){
      if(match === undefined || match == null){
        throw new Error('not found');
      }
      else{
        console.log('fetched from cache: ' + request.url);
      }

      return match || Promise.reject('no-match');
    });
  });
}

self.addEventListener('fetch', (event) => {
  console.log("[Event] Trying to fetching: " + event.request.url);
  var reqCopy = event.request.clone();
    if(cacheableApiEndpoints.filter((endpoint) => event.request.url.includes(endpoint)).length == 0){
      //nothing is coming from an API, so, we're going to fetch from cache
      event.respondWith(this.fetchFromCache(event.request)
        .catch((e) => {//oops, we might not find in cache, so we go fetch from network
            return fetchFromNetwork(event.request);
        }));
      return;
    }

    event.respondWith(fetchFromNetwork(event.request)
        .then((res) => {
            if (!res.ok) {
                throw Error('response status ' + res.status);
            }

            if(event.request.method === "GET"){
                //this is a brand new data from API, let's cache it (we never know when we'd go offline)
                var resCopy = res.clone();
                caches.open(cacheName)
                    .then(function(cache) {
                        return cache.put(reqCopy, resCopy);
                    });
            }
            return res;
        })
        .catch(function () {
            //something went wrong with network, let's fetch from cache
            console.log("Unable to fetch from network. Trying to retrieve " + event.request.url + " from cache");
            return fetchFromCache(event.request);
        }));  
});

self.addEventListener('install', function(e) {
    //self.skipWaiting(); 
    e.waitUntil(
	    caches.open(cacheName).then(function(cache) {
			  return cache.addAll(cacheFiles);
	    }));
});

self.addEventListener('activate', function(e) {
  //self.clients.claim();
  e.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== cacheName) {
            return caches.delete(thisCacheName);
          }
        }));
      }));
});