const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required:true,
        min: 0   
    },
    description: {
        type: String
    },

    imageUrl:{
        type: String,
        required:true
    },
    brand:{
        type: String,
    },

    createdAt:{
        type: String,
        required: true
    },
    creator: {
        type: String
    },
    buyers: [{ type: Types.ObjectId, ref: 'user' }]
});

module.exports = new mongoose.model('offer',offerSchema);