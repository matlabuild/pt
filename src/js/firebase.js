import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Note: Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDemo-replace-with-real-key",
  authDomain: "focus-app.firebaseapp.com",
  projectId: "focus-app",
  storageBucket: "focus-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
