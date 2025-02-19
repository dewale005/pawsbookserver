const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    participant: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        }
    ]
})

module.exports = mongoose.model('Conversion', conversationSchema);