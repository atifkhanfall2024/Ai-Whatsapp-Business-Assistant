const express = require('express')
const Connectdb = require('./lib/db')

const app = express()


Connectdb().then(()=>{
    console.log('Connection is Success');
    app.listen(3000 , ()=>{
    console.log('server is listening');
})
})
.catch((e)=>{
    console.log( e.message ||'Connection is not Eastablished');
})
