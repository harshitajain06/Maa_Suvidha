// Firebase configuration for web React app
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBQ_hO38Au1jFnYfLeY_18HVQ8Y87X6qzc",
  authDomain: "fir-react-c452d.firebaseapp.com",
  projectId: "fir-react-c452d",
  storageBucket: "fir-react-c452d.firebasestorage.app",
  messagingSenderId: "195494693330",
  appId: "1:195494693330:web:f39f5824ac9ad8b6d7200b",
  measurementId: "G-VTQ7X8BJ48"
};

// Initialize Firebase for web
const app = initializeApp(firebaseConfig);

// Initialize Firebase services for web
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services
export { app, auth, db, storage };
export const usersRef = collection(db, 'users');
