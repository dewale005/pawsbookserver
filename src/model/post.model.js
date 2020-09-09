const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, default: ''},
    posts: { type: Array },
    likes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'LikePost'},
        }
    ],
    comment: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments'},
        }
    ],
    date_created: { type: Date, default: Date.now()}
})

module.exports = mongoose.model('Posts', postSchema);