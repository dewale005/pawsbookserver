const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now()}
})

module.exports = mongoose.model('LikePost', likeSchema);