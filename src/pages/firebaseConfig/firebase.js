// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCuXxCASqoK4NLnmr7J78HIwEZC9CHMk2U",
  authDomain: "codrobot-e3b0d.firebaseapp.com",
  databaseURL: "http://codrobot-e3b0d-default-rtdb.firebaseio.com/",
  projectId: "codrobot-e3b0d",
  storageBucket: "codrobot-e3b0d.appspot.com",
  messagingSenderId: "48800254764",
  appId: "1:48800254764:web:9c85cec4365a06acfa7a89",
  measurementId: "G-6JQSE7S7KK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
// Initialize other Firebase modules if needed

export { db, app, auth };
