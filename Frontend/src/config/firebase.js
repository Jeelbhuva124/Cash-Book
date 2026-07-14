import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcbIIQKW7oZjrdrPAUxqaR5lvVOMgZ5-M",
  authDomain: "cash-book-1204.firebaseapp.com",
  projectId: "cash-book-1204",
  storageBucket: "cash-book-1204.firebasestorage.app",
  messagingSenderId: "110612279704",
  appId: "1:110612279704:web:f053caa4e0670eea847bed",
  measurementId: "G-G6Y4BYYXZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
