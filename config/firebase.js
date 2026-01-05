import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Ganti dengan konfigurasi dari Firebase Console Anda
const firebaseConfig = {
  apiKey: "AIzaSyCSA7Ewi045JyPKTuMW8mxmKSBkA0QmwOc",
  authDomain: "herbal-app-6c3f0.firebaseapp.com",
  projectId: "herbal-app-6c3f0",
  storageBucket: "herbal-app-6c3f0.firebasestorage.app",
  messagingSenderId: "1074243586988",
  appId: "1:1074243586988:web:b7635e45f49fb425d08809"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);