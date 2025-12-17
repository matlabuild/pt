import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD702sDy0upNA4f5I9RkluOBUdffHdkh0E",
  authDomain: "focus-app-e2a2f.firebaseapp.com",
  projectId: "focus-app-e2a2f",
  storageBucket: "focus-app-e2a2f.firebasestorage.app",
  messagingSenderId: "510889728896",
  appId: "1:510889728896:web:8c42d9f7f14f346ee63f65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
