// src/App.js
const express = require('express');
const Connectdb = require('./lib/db');
const fetch = require('node-fetch'); // npm install node-fetch@2
const WhatsApp = require('./routes/whatsapp');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/' , WhatsApp)

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



// POST /webhook to receive messages


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