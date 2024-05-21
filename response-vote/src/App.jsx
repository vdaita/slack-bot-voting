import React, { useState, useEffect } from 'react';

import Box from '@mui/joy/Box';
import { Container } from '@mui/joy';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

import { app, db } from './utils/firebase';
import { collection, getDocs, getDoc, doc, FieldValue, increment, setDoc} from 'firebase/firestore';

export default function Vote() {
    let [postId, setPostId] = useState("");
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
            const searchParams = new URLSearchParams(window.location.search);
            const postId = searchParams.get("postId");
            setPostId(postId);
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
            <Container m={4}>
                There was an error.
            </Container>
        )
    }

    if(loading) {
        return (
            <Container m={4}>
                Loading...
            </Container>
        )
    }

    if(!exists) {
        return (
            <Container m={4}>
                Post not found.
            </Container>
        )
    }

    if(voted) {
        return (
            <Container m={4}>
                Thank you for voting!
            </Container>
        )
    }

    return (
        <Container m={4}>
            <Stack>
                Voting on post:
                <br/>
                {body} <br/> <br/>
                What did you think about the post: 
                Current counter: 👍 = {thumbsUp} and 👎 = {thumbsDown}
                <Button onClick={() => likePost()}>👍</Button>
                <Button onClick={() => dislikePost()}>👎</Button>
            </Stack>
        </Container>
    )
};