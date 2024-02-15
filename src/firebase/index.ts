// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore"
import * as Firestore from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7liF9233dFFYzomLv1DJwOc6bvJsO_f4",
  authDomain: "bimdev-568e2.firebaseapp.com",
  projectId: "bimdev-568e2",
  storageBucket: "bimdev-568e2.appspot.com",
  messagingSenderId: "59034321527",
  appId: "1:59034321527:web:ce6f105b76b1a5c8b1fc72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDB =  getFirestore() //getting the reference to firebasse db in firesotre page

export function getCollection<T>(path: string){
    return Firestore.collection(firebaseDB,path) as Firestore.CollectionReference<T>;
}