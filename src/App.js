// src/App.js
const express = require('express');
const Connectdb = require('./lib/db');
const fetch = require('node-fetch'); // npm install node-fetch@2
require('dotenv').config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// WhatsApp Cloud API credentials from .env
const token = process.env.ACCESSTOKEN;      // WhatsApp Cloud API access token
const phoneNumberId = process.env.PHONEID;  // WhatsApp phone number ID

if (!token || !phoneNumberId) {
    console.error("ERROR: Please set ACCESSTOKEN and PHONEID in your .env file!");
    process.exit(1);
}

// Function to send a reply
async function sendReply(to, message) {
    try {
        const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to,
                text: { body: message }
            })
        });
        const data = await response.json();
        console.log("Send reply response:", data);
    } catch (err) {
        console.error("Error sending reply:", err);
    }
}

// GET /webhook for verification
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const tokenReceived = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && tokenReceived === VERIFY_TOKEN) {
        console.log("Webhook verified!");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// POST /webhook to receive messages
app.post("/webhook", async (req, res) => {
    // Always respond 200 OK immediately
    res.sendStatus(200);

    const entries = req.body.entry || [];
    for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
            const messages = change.value?.messages || [];
            for (const msg of messages) {
                // Ignore messages sent by your own WhatsApp number (avoid reply loop)
                if (msg.from === phoneNumberId) continue;

                // Only reply to text messages
                if (!msg.text?.body) continue;

                console.log("From:", msg.from);
                console.log("Message:", msg.text.body);

                // Send automatic reply
                await sendReply(msg.from, "Hello! I got your message.");
            }
        }
    }
});

// Connect DB and start server
Connectdb()
    .then(() => {
        console.log('Database connection established');
        app.listen(3000, () => {
            console.log('Server is listening on port 3000');
        });
    })
    .catch((e) => {
        console.log(e.message || 'Connection could not be established');
    });