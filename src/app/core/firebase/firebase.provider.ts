import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../services/firebase.config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase once
const app = initializeApp(firebaseConfig);

// Export shared instances
export const firestore = getFirestore(app); // Initialize Cloud Firestore to access the database
export const storage = getStorage(app);     // Initialice Cloud Storage to save multimedia content