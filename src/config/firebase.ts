import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyCwTjvEioAR4d2nHxegCDcImaowmGxn7jQ",
  authDomain: "techwave-81034.firebaseapp.com",
  projectId: "techwave-81034",
  storageBucket: "techwave-81034.firebasestorage.app",
  messagingSenderId: "1058350341266",
  appId: "1:1058350341266:web:a11fd488f30de608d71a4b",
  measurementId: "G-5T1CE55XJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;