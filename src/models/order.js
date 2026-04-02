const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    customer_id: {
        type: String,
        required: true
    },
    products: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
      address: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
} , {timestamps:true});

// Export the model
module.exports = model('Order', orderSchema);