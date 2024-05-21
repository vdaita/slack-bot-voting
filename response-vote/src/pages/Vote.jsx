import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

import { app, db } from '../utils/firebase';
import { collection, getDocs, getDoc, doc, FieldValue} from 'firebase/firestore';

export default function Vote() {
    let [searchParams, setSearchParams] = useSearchParams();
    
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState(false);

    let [exists, setExists] = useState(false);

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
            const postId = searchParams.get('postId');
            const postSnap = (await getDoc(doc(db, "posts", postId)));
            if(!postSnap.exists()){
                setExists(false);
            } else {
                const post = postSnap.data();
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
        let docRef = collection(db, "posts", searchParams.get('postId'));
        docRef.set({
            thumbsUp: FieldValue.increment(1)
        }, {merge: true});
        setVoted(true);
    }

    let dislikePost = async () => {
        let docRef = collection(db, "posts", searchParams.get('postId'));
        docRef.set({
            thumbsDown: FieldValue.increment(1)
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
                {body}
                What did you think about the post: 
                Current counter: 👍 = {thumbsUp} and 👎 = {thumbsDown}
                <Button onClick={() => likePost()}>👍</Button>
                <Button onClick={() => dislikePost()}>👎</Button>
            </Stack>
        </Box>
    )
}