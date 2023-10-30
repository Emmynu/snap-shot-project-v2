// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
import {getFirestore} from "firebase/firestore"

// config
const firebaseConfig = {
  apiKey: "AIzaSyBWX5aBfghYfw9EzUzYs0Iaq5kVgJGnXnI",
  authDomain: "snap-shot-v2.firebaseapp.com",
  projectId: "snap-shot-v2",
  storageBucket: "snap-shot-v2.appspot.com",
  messagingSenderId: "873413077717",
  appId: "1:873413077717:web:81652acec644d2bb3c105c",
  measurementId: "G-F32001RYGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getDatabase(app)
export const storage = getStorage(app)
export const provider = new GoogleAuthProvider() 
export const firestore = getFirestore(app)