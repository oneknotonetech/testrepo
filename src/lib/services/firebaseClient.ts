// lib/firebaseClient.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDK6ogVZulImRsPe2HGWedgmRQ7sWJ_0zc",
    authDomain: "interior-bundles-22f67.firebaseapp.com",
    databaseURL: "https://interior-bundles-22f67-default-rtdb.firebaseio.com",
    projectId: "interior-bundles-22f67",
    storageBucket: "interior-bundles-22f67.firebasestorage.app",
    messagingSenderId: "215770735135",
    appId: "1:215770735135:web:b2f3b615b11f3444dd2b2a",
    measurementId: "G-16PK81CXFS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
