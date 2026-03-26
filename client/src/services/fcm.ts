import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCeGfAydBnkHbi1zs3KyhaKYUG_BS79Q_Y",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mabco2-50951.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mabco2-50951",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "mabco2-50951.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "660821497353",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:660821497353:web:bf3ea2e1e698ac2052cad8",
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

export const ensureFirebaseApp = () => {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
};

export const requestFcmToken = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  if (!("Notification" in window)) return null;

  if (Notification.permission === "denied") {
    return null;
  }

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }
  }

  ensureFirebaseApp();
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );
  const messaging = getMessaging();
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY || undefined,
    serviceWorkerRegistration: registration,
  });
  return token || null;
};

export const listenForForegroundMessages = (handler: (payload: any) => void) => {
  ensureFirebaseApp();
  const messaging = getMessaging();
  return onMessage(messaging, handler);
};
