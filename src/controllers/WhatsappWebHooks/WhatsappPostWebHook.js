const sendReply = require('../../helpers/WhatsappSendReply')
const AICall = require('../../services/GeminiApi')
const MessageModel = require('../../models/messages')
const FastApiCall  = require('../../services/ragapi')
const PostWebHook =  async (req, res) => {
    const phoneNumberId = process.env.phoneid
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

              const messagesdata =  await MessageModel.create({
                    customer_id:msg.from,
                    message:msg.text.body ,
                    type:"inbound"
                })
               

                const res =  await FastApiCall(msg.text.body)
                console.log(res);
                messagesdata.botMessage=res
                await messagesdata.save()
                 
                // Send automatic reply
                await sendReply(msg.from, res);
            }
        }
    }
};

module.exports = PostWebHook