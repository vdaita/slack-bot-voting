const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./service-account-key.json')
  
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

(async() => {
    let documentId = Math.random().toString(36).slice(2);
    await db.collection('posts').doc(documentId).set({
        body: "Test",
        thumbsUp: 0,
        thumbsDown: 0
      }, {merge: true});
})();