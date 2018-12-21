# offline_pwa
Simple example of working PWA caching static assets and API request even in Safari (>=11.3)
This service worker solves an issue with Safari ERR_NETWORK_DISCONNECTED error that happens when you go offline
Basically, on each fectch event the sw does the following:

`1 - Check whether the requested url is an API endpoint`

`1.1 - It is not an API endpoint but static asset`

`1.1.1 - Open the cache and look for the asset`

`1.1.2 - If the asset is not cached then try to retrieve it from the network`

`1.1.2.1 - If navigator is online, fetches the url (this if statement is needed to handle Safari offline fetch error)`

`1.1.2.2 - If navigator is offline then tries to fetch the url from the cache. `

`1.1.2.3 - If the asset is not in cache, returns an empty respose 200`

`1.2 - It is an API endpoint`

`1.2.1 - If navigator is online, fetches the url (this if statement is needed to handle Safari offline fetch error)`

`1.2.2 - If navigator is offline then tries to fetch the url from the cache. `

`1.2.3 - If the asset is not in cache, returns an empty respose 200`

`1.2.4 - If the response was not ok throws an error to be catched and then fetched from cache`

`1.2.5 - If it was not an error and it was a GET request, caches the request response`


It was just an quick example. Feel free to suggest refactorings.
leovolpatto@gmail.com
