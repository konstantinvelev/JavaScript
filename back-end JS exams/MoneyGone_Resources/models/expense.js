const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const offerSchema = new mongoose.Schema({
    merchant: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
        default: new Date().toLocaleDateString()
    },
    total: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50
    },
    report: {
        type: Boolean,
        required: true,
        default:false
    },
    user: { type: Types.ObjectId, ref: 'user' }
});

module.exports = new mongoose.model('expense', offerSchema);