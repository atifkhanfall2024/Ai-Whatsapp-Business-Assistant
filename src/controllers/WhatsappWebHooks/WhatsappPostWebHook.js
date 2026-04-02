const sendReply = require('../../helpers/WhatsappSendReply');
const AICall = require('../../services/GeminiApi');
const MessageModel = require('../../models/messages');
const FastApiCall  = require('../../services/ragapi');
const order = require('../../models/order');

const PostWebHook = async (req, res) => {
    const phoneNumberId = process.env.phoneid;

    res.sendStatus(200);

    const entries = req.body.entry || [];

    for (const entry of entries) {
        for (const change of (entry.changes || [])) {
            for (const msg of (change.value?.messages || [])) {

                if (msg.from === phoneNumberId) continue;
                if (!msg.text?.body) continue;

                const text = msg.text.body.toLowerCase();

                console.log("From:", msg.from);
                console.log("Message:", text);

                const messagesdata = await MessageModel.create({
                    customer_id: msg.from,
                    message: text,
                    type: "inbound"
                });

                // 🔥 INTENT DETECTION
                let intent = "chat";

                if (
                    text.includes("need") ||
                    text.includes("order") ||
                    text.includes("chahiye")
                ) {
                    intent = "order";
                }

                // =========================
                // 🟢 CHAT (RAG)
                // =========================
                if (intent === "chat") {
                    try {
                        
                        const aiRes = await FastApiCall(text);
                        console.log(aiRes);
                        messagesdata.botMessage = aiRes;
                        await messagesdata.save();

                        await sendReply(msg.from, aiRes);
                    } catch (err) {
                        const fallback = "Please contact owner 😊";

                        await sendReply(msg.from, fallback);
                    }
                }

                // =========================
                // 🔵 ORDER (MULTI ITEMS)
                // =========================
                if (intent === "order") {

                    const orderPrompt = `
Extract order details.

Message: "${text}"

Return ONLY JSON:
{
  "items": [
    { "product": "", "quantity": number }
  ]
"address": "full delivery address as string"
}

If no order found return:
{
  "items": []
}
`;

                    try {
                        const aiOrder = await AICall(orderPrompt ,text);
                        //console.log(aiOrder.content);
                        const aiOrderText = aiOrder?.content;

if (!aiOrderText) {
    throw new Error("AI response empty");
}

const parsed = JSON.parse(aiOrderText); 

                        if (!parsed.items || parsed.items.length === 0) {
                            const reply = "Sir please clarify your order 😊";

                            return await sendReply(msg.from, reply);
                        }

                        // ✅ BUILD REPLY
                        let reply = "✅ Order confirm:\n";

                        parsed.items.forEach(item => {
                            reply += `- ${item.quantity} ${item.product}\n`;
                        });
                        let receivedProducts = aiOrder?.content;

                 // Parse the string to get actual object
                   let parsedProducts = JSON.parse(receivedProducts);

                   const confirm = parsedProducts.items.map(item=>({
                       name:item.product,
                       quantity:item.quantity
                   }))

                        await order.create({
                           customer_id:msg.from,
                           products:confirm,

                        })
                       

                        await sendReply(msg.from, reply);

                    } catch (err) {
                        console.log("Order Error:", err);

                        const reply = "Sir order samajh nahi aaya, please dubara likhen 😊";

                     

                        await sendReply(msg.from, reply);
                    }
                }

            }
        }
    }
};

module.exports = PostWebHook;