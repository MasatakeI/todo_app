import { initializeApp } from "firebase/app";

import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwBtNtSF1L6a33wEZ-ouETBMIoU2JgyBc",
  authDomain: "todo-app-e5c44.firebaseapp.com",
  projectId: "todo-app-e5c44",
  storageBucket: "todo-app-e5c44.firebasestorage.app",
  messagingSenderId: "225943597012",
  appId: "1:225943597012:web:60d163d9bef4d2a24c3041",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const todosCollectionRef = collection(db, "todos");
