// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYSqmDGauzNRTxIuQbBSnIwXOJfyTb7w8",
  authDomain: "lebos-bookings.firebaseapp.com",
  projectId: "lebos-bookings",
  storageBucket: "lebos-bookings.firebasestorage.app",
  messagingSenderId: "723491878796",
  appId: "1:723491878796:web:106de9a010276f1a4cc8a9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);