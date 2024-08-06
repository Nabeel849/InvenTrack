// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaERVmaUAnJbmVkYPrxmCzGe5Gcvs9LJA",
  authDomain: "inventory-management-9c98b.firebaseapp.com",
  projectId: "inventory-management-9c98b",
  storageBucket: "inventory-management-9c98b.appspot.com",
  messagingSenderId: "644058424001",
  appId: "1:644058424001:web:c7a656afa86b8608416a40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};