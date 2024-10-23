import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase} from "firebase/database";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ma-aji-game.firebaseapp.com",
  projectId: "ma-aji-game",
  storageBucket: "ma-aji-game.appspot.com",
  messagingSenderId: "851220422579",
  appId: "1:851220422579:web:efd99a6199c505f80cb5c6",
  measurementId: "G-KLQCG6Q55T"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const db = getFirestore(app);
export const firebaseStorage = getStorage(
  
);


export const auth  = getAuth(app);
