const CACHE = 'foodiebite-v1';
const ASSETS = [
	'/',
	'/index.html',
	'/styles.css'
];
self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => {
	event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then(res => res || fetch(event.request).then(fetchRes => {
			const copy = fetchRes.clone();
			caches.open(CACHE).then(cache => cache.put(event.request, copy));
			return fetchRes;
		}))
	);
});
