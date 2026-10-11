import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyASkMXMZniUt6PoMAUAKTvuuyT1AqSZM-M",
  authDomain: "smartmarket-ccfbe.firebaseapp.com",
  projectId: "smartmarket-ccfbe",
  storageBucket: "smartmarket-ccfbe.firebasestorage.app",
  messagingSenderId: "762336784213",
  appId: "1:762336784213:web:f05de7670c55ac4184c9dc"
};


const appJaIniciado = getApps().length > 0;
const app = appJaIniciado ? getApp() : initializeApp(firebaseConfig);

const auth = appJaIniciado
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

const db = getFirestore(app);

export { app, auth, db };
