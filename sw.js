const CACHE = 'atx-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(resp => {
      const clone=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request, clone));
      return resp;
    }).catch(()=>caches.match(e.request))
  );
});

// Push notifications
self.addEventListener('push', e => {
  const data=e.data?.json()||{};
  e.waitUntil(
    self.registration.showNotification(data.title||'ATX — Recordatorio', {
      body: data.body||'Tenés un vencimiento próximo',
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200,100,200],
      tag: data.tag||'atx-notif',
      data: {url: './'}
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cls=>{
    if(cls.length) return cls[0].focus();
    return clients.openWindow('./');
  }));
});
