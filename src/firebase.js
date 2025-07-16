import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-d5oQ9Nr17uRnGCtOjIPrLw_x4vg4FcY",
  authDomain: "redeai.firebaseapp.com",
  projectId: "redeai",
  storageBucket: "redeai.firebasestorage.app",
  messagingSenderId: "975579338232",
  appId: "1:975579338232:web:642d71154a3611e276320d",
  measurementId: "G-1DFB8ECWSK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };