const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, default: '' },
    likes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'LikePost' },
        }
    ],
    reply: [
        {
            message: { type: mongoose.Schema.Types.ObjectId, ref: 'ReplyComment' }
        }
    ],
    created_date: { type: Date, default: Date.now()}
})

module.exports = mongoose.model('Comments', commentSchema);