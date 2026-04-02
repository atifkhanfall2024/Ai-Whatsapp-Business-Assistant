const OpenAI = require('openai')
require('dotenv').config()

const AICall = async(message , text)=>{
try {
    const openai = new OpenAI({
    apiKey: process.env.GEMINI,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const response = await openai.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [
        {   role: "system",
            content: message
        },
        {
            role: "user",
            content: text,
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