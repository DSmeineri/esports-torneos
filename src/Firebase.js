// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDHGJgZAlHO6R9qrFo2Se8HpFhjDNrqT68",
    authDomain: "esports-torneos.firebaseapp.com",
    projectId: "esports-torneos",
    storageBucket: "esports-torneos.firebasestorage.app",
    messagingSenderId: "72708305253",
    appId: "1:72708305253:web:575ff4ad584f8ff37af18c",
    measurementId: "G-3XCYY183X6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);