// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getAuth } from 'firebase/auth';           // Import Authentication
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT3Jb3JsXnEM-KS2zgWTANwsB8rz432BA",
  authDomain: "back-up-plan-89dea.firebaseapp.com",
  projectId: "back-up-plan-89dea",
  storageBucket: "back-up-plan-89dea.firebasestorage.app",
  messagingSenderId: "1094558417308",
  appId: "1:1094558417308:web:bdeb1418920ff8d0ec4859"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);