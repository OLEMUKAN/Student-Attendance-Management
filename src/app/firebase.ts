// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP4HGQo9E5HsKU724znuPq2efApQX42A0",
  authDomain: "attendance-b5029.firebaseapp.com",
  projectId: "attendance-b5029",
  storageBucket: "attendance-b5029.appspot.com",
  messagingSenderId: "396880833878",
  appId: "1:396880833878:web:0fb40ddc2612a65e477af7"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
setPersistence(auth, browserLocalPersistence);
export { auth, db };