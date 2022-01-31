// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANJYOlmz7jUIp1NkNvoMzoYXz1KbtO4R4",
  authDomain: "sparta-react-basic-c3161.firebaseapp.com",
  projectId: "sparta-react-basic-c3161",
  storageBucket: "sparta-react-basic-c3161.appspot.com",
  messagingSenderId: "80495849987",
  appId: "1:80495849987:web:c362f3d706e79617db9436",
  measurementId: "G-K40R66J47X"
};

initializeApp(firebaseConfig);
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

export const db = getFirestore();