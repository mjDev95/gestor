import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  
import { getFirestore } from "firebase/firestore";

//web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYS5TnJ82fMw_4AWeNIg7UPIJWOYDB040",
  authDomain: "control-gastos-19b34.firebaseapp.com",
  projectId: "control-gastos-19b34",
  storageBucket: "control-gastos-19b34.firebasestorage.app",
  messagingSenderId: "676080050874",
  appId: "1:676080050874:web:abe08654c1fe9749b09883"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
