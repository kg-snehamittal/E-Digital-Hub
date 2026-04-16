// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbW3Px1Pq54zOouJzCNmkMlFeZe3qC8tU",
  authDomain: "e-commers-b20f4.firebaseapp.com",
  projectId: "e-commers-b20f4",
  storageBucket: "e-commers-b20f4.appspot.com",
  messagingSenderId: "740245330490",
  appId: "1:740245330490:web:dfc0d55088b2819af5b303"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB, auth}