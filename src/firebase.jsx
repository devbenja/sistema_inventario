// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9mKO8LdvA3E_yRojhjT7NbMQyF4Lbh28",
  authDomain: "react-login-fb-auth.firebaseapp.com",
  projectId: "react-login-fb-auth",
  storageBucket: "react-login-fb-auth.appspot.com",
  messagingSenderId: "980904557149",
  appId: "1:980904557149:web:8801fd9178b23abf42abb4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
