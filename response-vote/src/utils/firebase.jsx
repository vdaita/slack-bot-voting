import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
 
const firebaseConfig = {
    apiKey: "AIzaSyCt9SqiWp1uz0TCNZSM6UCfz_088JoNy2s",
    authDomain: "polyagent-vote.firebaseapp.com",
    projectId: "polyagent-vote",
    storageBucket: "polyagent-vote.appspot.com",
    messagingSenderId: "937822224611",
    appId: "1:937822224611:web:0b40fe4aa1c1ec75ee05d6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);