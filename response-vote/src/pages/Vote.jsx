import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

import { app, db } from '../utils/firebase';
import { collection, getDocs, getDoc, doc, FieldValue, increment, setDoc} from 'firebase/firestore';

export default function Vote() {
    let { postId } = useParams();
    
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(false);

    let [exists, setExists] = useState(true);

    let [body, setBody] = useState("");
    
    let [thumbsUp, setThumbsUp] = useState(0)
    let [thumbsDown, setThumbsDown] = useState(0);
    
    let [voted, setVoted] = useState(false);

    useEffect(() => {
        loadPost();
    }, []);

    let loadPost = async () => {
        console.log("starting loadPost");
        try {
            console.log("Post id: ", postId);
            const postSnap = (await getDoc(doc(db, "posts", postId)));
            console.log("Post snapshot: ", postSnap);
            if(!postSnap.exists()){
                setExists(false);
            } else {
                const post = postSnap.data();
                console.log("Post data: ", post);
                setBody(post.body);
                setThumbsUp(post.thumbsUp);
                setThumbsDown(post.thumbsDown);    
            }
            
            setLoading(false);
        } catch (e) {
            console.error(e);
            setError(true);
        }
    }

    let likePost = async () => {
        let docRef = doc(db, "posts", postId);
        await setDoc(docRef, {
            thumbsUp: increment(1)
        }, {merge: true});
        setVoted(true);
    }

    let dislikePost = async () => {
        let docRef = doc(db, "posts", postId);
        await setDoc(docRef, {
            thumbsDown: increment(1)
        }, {merge: true});
        setVoted(true);
    }

    if(error) {
        return (
            <Box>
                There was an error.
            </Box>
        )
    }

    if(loading) {
        return (
            <Box>
                Loading...
            </Box>
        )
    }

    if(!exists) {
        return (
            <Box>
                Post not found.
            </Box>
        )
    }

    if(voted) {
        return (
            <Box>
                Thank you for voting!
            </Box>
        )
    }

    return (
        <Box>
            <Stack>
                Voting on post:
                <br/>
                {body} <br/> <br/>
                What did you think about the post: 
                Current counter: 👍 = {thumbsUp} and 👎 = {thumbsDown}
                <Button onClick={() => likePost()}>👍</Button>
                <Button onClick={() => dislikePost()}>👎</Button>
            </Stack>
        </Box>
    )
}