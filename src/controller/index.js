const { userRegistration, userlogin, userData, edituserData, allusers, followUser } = require('./user.controller')
const { create_post, like_post, get_post} = require('./post.controller')
const { create_comment, chat_with_user, get_all_messages, get_chatList } = require('./comment.controller')

module.exports = {
    userRegistration,
    userlogin,
    userData,
    edituserData,
    create_post,
    like_post,
    create_comment,
    get_post,
    allusers,
    followUser,
    chat_with_user,
    get_all_messages,
    get_chatList,
}