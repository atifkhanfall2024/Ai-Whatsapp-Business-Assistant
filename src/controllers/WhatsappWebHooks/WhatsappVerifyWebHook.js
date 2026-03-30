require('dotenv').config()
const VerifyWebHook =  (req, res) => {
   try {
     const VERIFY_TOKEN = process.env.VERIFY_TOKEN
    const mode = req.query["hub.mode"];
    const tokenReceived = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && tokenReceived === VERIFY_TOKEN) {
        console.log("Webhook verified!");
        res.status(200).send(challenge);
        res.status(200).send(" Verification succeess ")
    } else {
        res.sendStatus(403);
    }
   } catch (error) {
    console.log(error.message || "Something went wrong");
    res.status(401).send(error.message || "Something went wrong")
   }
};

module.exports = VerifyWebHook