importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

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
  console.log('ATX push recibido:', payload);
  const title = payload.notification?.title || 'ATX — Recordatorio';
  const body  = payload.notification?.body  || 'Tenés un vencimiento próximo';
  self.registration.showNotification(title, {
    body,
    icon:    '/ATX-Obligaciones/icon-192.png',
    badge:   '/ATX-Obligaciones/icon-192.png',
    vibrate: [200, 100, 200],
    data:    { url: '/ATX-Obligaciones/' }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(cls => {
      for(const cl of cls){
        if(cl.url.includes('ATX-Obligaciones')) return cl.focus();
      }
      return clients.openWindow('/ATX-Obligaciones/');
    })
  );
});
