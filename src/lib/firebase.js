import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-469c8.firebaseapp.com",
  projectId: "react-chat-469c8",
  storageBucket: "react-chat-469c8.appspot.com",
  messagingSenderId: "6738346144",
  appId: "1:6738346144:web:8ba0a03b0026c30d3cc9c5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()