const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversion" },
    participant1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participant2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: [
        {   
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            body: { type: String },
            attachment: { type: Array },
            isRead: { type: Boolean, default: false },
            isEdited: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now() },
            updatedAt: { type: Date, default: Date.now() }
        }
    ],
});

module.exports = mongoose.model('Chat', chatSchema);