
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDmF2wotrVgA6BsvApzE-BFaSccxn1UDWc",
    authDomain: "taskflow-40926.firebaseapp.com",
    projectId: "taskflow-40926",
    storageBucket: "taskflow-40926.firebasestorage.app",
    messagingSenderId: "1013479706111",
    appId: "1:1013479706111:web:c7362eaf00dfcc0e0d2bca",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
