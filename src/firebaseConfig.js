import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJsMBASI57U7qtGfV-thyq1WnNpCRvvLk",
  authDomain: "athleteeval.firebaseapp.com",
  projectId: "athleteeval",
  storageBucket: "athleteeval.firebasestorage.app",
  messagingSenderId: "774922414334",
  appId: "1:774922414334:web:ea5a217b7cb3804afdddaf",
  measurementId: "G-5DFV9VLGKM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);