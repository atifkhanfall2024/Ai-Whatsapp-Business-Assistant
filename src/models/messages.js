const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({

    customer_id:{
        type:String ,
        required:[true , "Customer id required"]
    },

    message:{
        type:String,
        required:[true , "Message required"]
    },
    botMessage:{
     type:String,
    },

    type:{
        type:String,
        enum:["inbound" , "outbound"],
        required:true
    },

    timestamp:{
        type: Date,
        default: Date.now
    }

},{timestamps:true})

const MessageModel = mongoose.model('MessageModel', MessageSchema)

module.exports = MessageModel