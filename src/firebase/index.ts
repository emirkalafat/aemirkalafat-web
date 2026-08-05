import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { isSupported, getAnalytics, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Analytics relies on IndexedDB/cookies, which aren't available in every
// environment (SSR, some privacy modes) — isSupported() guards against that.
let analyticsInstance: Analytics | null = null
export const analyticsReady: Promise<Analytics | null> = isSupported()
  .then(supported => {
    if (!supported || !firebaseConfig.measurementId) return null
    analyticsInstance = getAnalytics(app)
    return analyticsInstance
  })
  .catch(() => null)
