import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Log Firebase configuration (without sensitive values)
console.log("Firebase initialized with config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId
});

// Configure Google provider to request additional scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Set custom parameters for the auth provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

/**
 * Request notification permission and get FCM token.
 * Returns null if permission denied or VAPID key is missing.
 */
export async function getFCMToken(): Promise<string | null> {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn('VITE_FIREBASE_VAPID_KEY not set — push notifications disabled');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    return await getToken(messaging, { vapidKey });
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}

export { onMessage };

export default app;