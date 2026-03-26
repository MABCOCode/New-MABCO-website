importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCeGfAydBnkHbi1zs3KyhaKYUG_BS79Q_Y",
  authDomain: "mabco2-50951.firebaseapp.com",
  projectId: "mabco2-50951",
  storageBucket: "mabco2-50951.firebasestorage.app",
  messagingSenderId: "660821497353",
  appId: "1:660821497353:web:bf3ea2e1e698ac2052cad8"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const data = payload.data || {};
  const notificationTitle = data.title || 'New Message';
  const notificationOptions = {
    body: data.body || 'You have a new message',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    image: data.image_url || undefined,
    data: {
      click_action_url: data.click_action_url || 'https://mabcoonline.com/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  const urlToOpen = event.notification.data?.click_action_url;
  if (urlToOpen) {
    event.notification.close();
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});
