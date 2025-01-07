import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBzMnT7v_LslMhuR5GJPibvyr2BZHKeiLE",
    authDomain: "ptsm-c1d5a.firebaseapp.com",
    projectId: "ptsm-c1d5a",
    storageBucket: "ptsm-c1d5a.firebasestorage.app",
    messagingSenderId: "301834564785",
    appId: "1:301834564785:web:a309987356904b57679e90"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 