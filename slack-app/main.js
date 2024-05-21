const { App } = require('@slack/bolt');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./service-account-key.json')

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  port: 3000
});

initializeApp({
    credential: cert(serviceAccount)
});
  
const db = getFirestore();

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

app.message("VOR Test", async({message, say}) => {
    console.log("Received a testing message!");
    console.log(message);
})

/* Add functionality here */
app.message("Daily AI Papers Digest:", async({message, say}) => {
    console.log("Received a message!");
    // Break down the text into paragraphs
    const paragraphs = message.text.split(/\n\n+/);
    for(var i = 0; i < paragraphs.length; i++){
        const paragraph = paragraphs[i];
        
        let documentId = uuidv4();
        await db.collection('posts').doc(documentId).set({
            body: paragraph,
            thumbsUp: 0,
            thumbsDown: 0
          });

        await say({
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `**Vote on this paragraph:**\n${paragraph}`
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Vote"
                        },
                        "value": documentId,
                        "url": `https://localhost:5173/vote/${documentId}`,
                        "action_id": "vote"
                    }
                }
            ]
        });
    }
});

(async () => {
  // Start the app
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();