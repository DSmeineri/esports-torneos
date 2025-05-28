import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHGJgZAlHO6R9qrFo2Se8HpFhjDNrqT68",
  authDomain: "esports-torneos.firebaseapp.com",
  projectId: "esports-torneos",
  storageBucket: "esports-torneos.appspot.com", // ✅ corregido aquí
  messagingSenderId: "72708305253",
  appId: "1:72708305253:web:575ff4ad584f8ff37af18c",
  measurementId: "G-3XCYY183X6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
