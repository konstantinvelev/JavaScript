const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 50
    },
    imageUrl: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true
    },
    creator: {
        type: String
    },
    usersEnrolled: [{ type: Types.ObjectId, ref: 'user' }]
});

module.exports = new mongoose.model('course', courseSchema);