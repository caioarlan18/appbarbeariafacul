import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBqVMzJLdNJtp66-7aIXdJ1PB6aVwCbpMg",
    authDomain: "appbarbeariafacul.firebaseapp.com",
    projectId: "appbarbeariafacul",
    storageBucket: "appbarbeariafacul.firebasestorage.app",
    messagingSenderId: "955871243386",
    appId: "1:955871243386:web:32dbd327fcc195d3e01fc3",
    measurementId: "G-V2NW2NZ8SY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
