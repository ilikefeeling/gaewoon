import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with Long-Polling to bypass WebSocket instability
const firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

// Force long polling to avoid WebSocket issues in some environments (e.g. strict firewalls or specific browser extensions)
// settings(firestore, { experimentalForceLongPolling: true }); // Note: This is deprecated in v9, use initializeFirestore if needed, but let's try standard first with StrictMode off.
// Actually, let's keep it standard first. If StrictMode off doesn't fix it, we will add long polling.


console.log("Firebase Init:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKeyPresent: !!firebaseConfig.apiKey
});

export { auth, firestore, signInAnonymously };
