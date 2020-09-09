const mongoose = require('mongoose');

const replyCommentSchema = mongoose.Schema({
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },
    response: { type: String, require: [true, "A response is required"] },
    authur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            date: { type: Date, default: Date.now() }
        }
    ],
    created_date: { type: Date, default: Date.now()}
})

module.exports = mongoose.model('ReplyComment', replyCommentSchema);