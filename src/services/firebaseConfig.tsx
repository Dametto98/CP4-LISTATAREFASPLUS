import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection,addDoc,getDocs,doc,updateDoc,deleteDoc } from "firebase/firestore";

//Pegar o getReactNatvePersistence mesmo sem tipagem
const{getReactNativePersistence} = require("firebase/auth") as any

const firebaseConfig = {
  apiKey: "AIzaSyAZHzfoi61SQUSzUntFMynMj6-UUpnNIcg",
  authDomain: "cp4-listatarefasplus.firebaseapp.com",
  projectId: "cp4-listatarefasplus",
  storageBucket: "cp4-listatarefasplus.firebasestorage.app",
  messagingSenderId: "1024555257607",
  appId: "1:1024555257607:web:570b0d8fa5286c9f43ffa2",
  measurementId: "G-3L7QB05GE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const auth = initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
});

export{auth,db,collection,addDoc,getDocs,doc,updateDoc,deleteDoc}