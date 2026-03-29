const mongoose = require('mongoose')
require('dotenv').config()

 const Connectdb = async()=>{
 
    await mongoose.connect(process.env.Connection_String)
}

module.exports = Connectdb