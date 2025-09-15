// Firebase Configuration Setup Script
// Run this script to set up the OpenAI API key in Firebase

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase config (same as in your firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyBQ_hO38Au1jFnYfLeY_18HVQ8Y87X6qzc",
  authDomain: "fir-react-c452d.firebaseapp.com",
  projectId: "fir-react-c452d",
  storageBucket: "fir-react-c452d.firebasestorage.app",
  messagingSenderId: "195494693330",
  appId: "1:195494693330:web:f39f5824ac9ad8b6d7200b",
  measurementId: "G-VTQ7X8BJ48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to set up the OpenAI API key
async function setupOpenAIConfig(apiKey) {
  try {
    await setDoc(doc(db, 'config', 'openai'), {
      apiKey: apiKey,
      lastUpdated: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString()
    });
    console.log('✅ OpenAI API key configuration saved successfully!');
  } catch (error) {
    console.error('❌ Error saving API key configuration:', error);
  }
}

// Example usage:
// setupOpenAIConfig('your-openai-api-key-here');

export { setupOpenAIConfig };
