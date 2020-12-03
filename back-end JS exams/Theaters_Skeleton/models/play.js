const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const offerSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    imageUrl:{
        type: String,
        required:true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: String,
        required: true
    },
    creator:{
        type: String,
    },
    usersLiked : [{ type: Types.ObjectId, ref: 'user' }]
});

module.exports = new mongoose.model('play',offerSchema);