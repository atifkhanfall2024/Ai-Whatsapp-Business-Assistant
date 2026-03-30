const OpenAI = require('openai')
require('dotenv').config()

const AICall = async(message)=>{
try {
    const openai = new OpenAI({
    apiKey: process.env.GEMINI,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const response = await openai.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [
        {   role: "system",
            content: "You are a helpful assistant. you main aim is to handle user messages you work as an ai whatsapp business assistant to handle and manage user orders , your message is short and look professional" 
        },
        {
            role: "user",
            content: message,
        },
    ],
});
//console.log(response.choices[0].message);
return response.choices[0].message

} catch (error) {
    console.error(error);
}
}

module.exports =AICall