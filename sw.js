importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Cache normal
const CACHE = 'atx-v4';
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
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c));return r;}).catch(()=>caches.match(e.request)));
});

// Firebase Messaging
firebase.initializeApp({
  apiKey:            "AIzaSyDA9t2kF4oXLzeHPpVdu1YVbB2NgOIN0_k",
  authDomain:        "atx-obligaciones.firebaseapp.com",
  projectId:         "atx-obligaciones",
  storageBucket:     "atx-obligaciones.firebasestorage.app",
  messagingSenderId: "219319168826",
  appId:             "1:219319168826:web:525e18668e835e07736a03"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('ATX push:', payload);
  const title = payload.notification?.title || payload.data?.title || 'ATX';
  const body  = payload.notification?.body  || payload.data?.body  || 'Tenés una obligación próxima';
  return self.registration.showNotification(title, {
    body,
    icon:     '/ATX-Obligaciones/icon-192.png',
    badge:    '/ATX-Obligaciones/icon-192.png',
    vibrate:  [200, 100, 200],
    tag:      title,
    renotify: true,
    data:     { url: '/ATX-Obligaciones/' }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(cls=>{
      for(const cl of cls){ if(cl.url.includes('ATX-Obligaciones')) return cl.focus(); }
      return clients.openWindow('/ATX-Obligaciones/');
    })
  );
});
