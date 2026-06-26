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

// Manejar notificaciones cuando la app está en background
messaging.onBackgroundMessage(function(payload) {
  console.log('ATX background message:', payload);
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'ATX', {
    body:    body || 'Tenés un vencimiento próximo',
    icon:    './icon-192.png',
    badge:   './icon-192.png',
    vibrate: [200, 100, 200],
    data:    { url: './' }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cls=>{
    if(cls.length) return cls[0].focus();
    return clients.openWindow('./');
  }));
});
