import React, { useState, useEffect } from 'react';
import { app, database } from './../utils/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getDoc, doc, setDoc} from 'firebase/firestore';

import Snackbar from '@mui/joy/Snackbar'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Textarea from '@mui/joy/Textarea'
import Input from '@mui/joy/Input'

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export default function Create() {
    let [user, getUser] = useState(false);
    let [message, setMessage] = useState("");

    let [body, setBody] = useState("");

    useEffect(() => {
        onAuthStateChanged
    }, []);
    
    let authenticate = () => {
        const auth = getAuth();
        signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
                getUser(result.user);
            })
        .catch((error) => {
                console.log(error);
        });
    }

    let post = async () => {
        let documentId = uuidv4();
        await setDoc(doc(database, "posts", documentId), {
            body: body,
            thumbsUp: 0,
            thumbsDown: 0
        });
        
    }

    if(user) {
        return (
            <Box>
                <Button onClick={() => authenticate()}>Log in with Google</Button>
            </Box> 
        )
    }

    return (
        <Box>
            <Textarea onChange={(e) => setDescription(e.target.value)}/>
            <Button onClick={() => post()}>Post</Button>
            
            
        </Box>
    )
}