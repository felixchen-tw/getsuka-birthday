// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrkYb18cTj_RGbNl0HTfZQb_BphgOo_7M",
  authDomain: "getsuka-birthday.firebaseapp.com",
  projectId: "getsuka-birthday",
  storageBucket: "getsuka-birthday.firebasestorage.app",
  messagingSenderId: "322203221009",
  appId: "1:322203221009:web:69be730a381793af8305b0",
  measurementId: "G-QTEK1WK5GV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };