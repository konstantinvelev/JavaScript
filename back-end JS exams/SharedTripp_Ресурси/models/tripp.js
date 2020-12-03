const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const offerSchema = new mongoose.Schema({
    startPoint  : {
        type: String,
        required: true,
    },
    еndPoint : {
        type: String,
        required: true,
    },
    date :{
        type: String,
        required:true
    },
    time : {
        type: String,
        default: false
    },
    seats :{
        type: Number,
        required: true
    },
    description  :{
        type: String,
        required: true
    },
    carImage  :{
        type: String,
        required: true
    },
    creator:{
        type: String,
    },
    buddies : [ ]
});

module.exports = new mongoose.model('tripp',offerSchema);