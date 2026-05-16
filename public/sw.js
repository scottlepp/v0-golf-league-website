// PDP Golf League — basic service worker.
// Caches the app shell and serves a cached response on offline navigation.

const CACHE_NAME = 'pdp-golf-v1'
const APP_SHELL = ['/', '/manifest.webmanifest', '/icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => {})),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  // never cache auth or score POSTs
  if (url.pathname.startsWith('/api/auth')) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/') || new Response('Offline', { status: 503 })),
    )
    return
  }

  if (url.pathname.startsWith('/_next/static') || APP_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req).then((resp) => {
          if (resp.ok) {
            const copy = resp.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy))
          }
          return resp
        })
      }),
    )
  }
})
