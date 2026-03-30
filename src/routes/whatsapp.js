const express  = require('express')
const VerifyWebHook = require('../controllers/WhatsappWebHooks/WhatsappVerifyWebHook')
const PostWebHook = require('../controllers/WhatsappWebHooks/WhatsappPostWebHook')


const WhatsApp = express.Router()



WhatsApp.get('/webhook' , VerifyWebHook)
WhatsApp.post('/webhook' , PostWebHook )


module.exports = WhatsApp