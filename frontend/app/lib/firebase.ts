import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8Z39y6Gq8FlvnZj1QaTufX4Pjko3BxGM",
  authDomain: "nouai-studio-9880d.firebaseapp.com",
  projectId: "nouai-studio-9880d",
  storageBucket: "nouai-studio-9880d.firebasestorage.app",
  messagingSenderId: "764223526326",
  appId: "1:764223526326:web:4489b4b608f94e730bdd17"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };