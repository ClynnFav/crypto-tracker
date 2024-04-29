import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAW60szQlUGbK8HYfLD0Eyu9O4mQbIVit8",
  authDomain: "crypto-vortex-792ce.firebaseapp.com",
  projectId: "crypto-vortex-792ce",
  storageBucket: "crypto-vortex-792ce.appspot.com",
  messagingSenderId: "560056339474",
  appId: "1:560056339474:web:9f6f2f2a08db94b6e0dccb",
  measurementId: "G-GVZWPNQRKD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);