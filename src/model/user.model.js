const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, default: '', unique: true },
    email: { type: String, default: '', unique: true },
    password: { type: String, default: '' },
    name: { type: String, default: '' },
    webUrl: { type: String, default: '' },
    phone: { type: String, default: '' },
    bioData: { type: String, default: '' },
    gender: { type: String, default: 'prefer not to say' },
    avatar: { type: String, default: '' },
    following: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            date: { type: Date, default: Date.now() },
            accepted: { type: Boolean, default: false }
        }
    ],
    followers: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            date: { type: Date, default: Date.now() },
            accepted: { type: Boolean, default: false }
        }
    ]
})

module.exports = mongoose.model('User', userSchema);