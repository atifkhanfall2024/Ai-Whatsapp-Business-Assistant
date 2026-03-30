require('dotenv').config()
async function sendReply(to, message) {
    try {
        const phoneNumberId = process.env.phoneid
        const token = process.env.Accesstoken
        //console.log(phoneNumberId, token);
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

module.exports = sendReply