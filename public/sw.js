const CACHE_NAME = 'ngoms-ai-v2'
const STATIC = ['/', '/index.html', '/manifest.json', '/favicon.svg']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC).catch(()=>{})))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  // Network-first for APIs
  if (url.hostname.includes('base44') || url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
    return
  }
  // Cache-first for built assets
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(r => {
        if (r.ok) caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone()))
        return r
      })
    }))
    return
  }
  // SPA fallback
  e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')))
})
