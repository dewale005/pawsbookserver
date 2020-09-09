const jwtDecode = require('jwt-decode');
const Comment = require('../model/comment.model');
const Post = require('../model/post.model');
const Conversation = require('../model/Conversation.model');
const Message = require('../model/chat.model');
const { CreateComment } = require('../service/validation');

module.exports = {
    async create_comment(req, res, next) {
        try {
            const { value, error } = CreateComment(req.body);
			if (error) {
				res.status(400).json({ message: 'Write a comment' });
			}
            const { id } = req.params;
			const token = req.headers.authorization.split('bearer ')[1];
            const decoded = jwtDecode(token);
            let comment = {
                post: id,
                user: decoded.id,
                description: value.description
            }
            const post = Post.find({ _id: id })
            if (post.length === 0) {
                res.status(400).json({ message: 'No post found' });
            } else {
                const com = await Comment.create(comment)
                await Post.updateOne(
                    {
                        _id: id
                    }, {
                    $push: {
                        comment: {
                            $each: [
                                {
                                    user: com._id
                                }
                            ],
                            $position: 0
                        }
                    }
                }
                )
                res.status(200).json(com);
            }
        } catch (error) {
            next(error);
        }
    },

    async chat_with_user(req, res, next) {
        try {
            const { reciever } = req.params
            const token = req.headers.authorization.split('bearer ')[1];
            const decoded = jwtDecode(token);
            Conversation.find({
                $or: [
                    { participant: { $elemMatch: { senderId: decoded.id, receiverId: reciever } } },
                    { participant: { $elemMatch: { senderId: reciever, receiverId: decoded.id } } }
                ]
            }, async (err, result) => {
                console.log(result.length);
                if (result.length > 0) {
                    await Message.updateOne(
                        {
                            conversationId: result[0]._id
                        }, {
                        $push: {
                            message: {
                                senderId: decoded.id,
                                receiverId: reciever,
                                body: req.body.message,
                                attachment: req.body.attachment,
                            }
                        }
                    }
                    ).then(() => res.status(200).json({ message: 'message sent successfully' }))
                        .catch(err => res.status(500).json({ message: 'Error occured' }))

                } else {
                    const newConversation = new Conversation();
                    newConversation.participant.push({
                        senderId: decoded.id,
                        receiverId: reciever
                    });

                    const saveConversation = await newConversation.save();

                    const newMessage = new Message();
                    newMessage.conversationId = saveConversation._id;
                    newMessage.participant1 = decoded.id;
                    newMessage.participant2 = reciever;
                    newMessage.message.push({
                        senderId: decoded.id,
                        receiverId: reciever,
                        body: req.body.message,
                        attachment: req.body.attachment,
                    })
                    await newMessage.save()
                        .then(() => res.status(200).json({ message: 'Message sent' }))
                        .catch(err => res.status(500).json({ message: 'Error Occured' }));

                }
            });
        } catch (error) {
            next(error);
        }
    },

    async get_all_messages(req, res, next) {
        try {
            const { id } = req.params;
            const token = req.headers.authorization.split('bearer ')[1];
            const decoded = jwtDecode(token);
            const conversation = await Conversation.findOne({
                $or: [
                    {
                        $and: [{ 'participant.senderId': decoded.id }, { 'participant.receiverId': id }]
                    },
                    {
                        $and: [{ 'participant.senderId': id }, { 'participant.receiverId': decoded.id }]
                    }
                ]
            }).select('_id');
            if (conversation) {
                const message = await Message.findOne({ conversationId: conversation._id })
                res.status(200).json(message);
            }
        } catch (error) {
            next(error);
        }
    },

    async get_chatList(req, res, next) {
        try {
            const token = req.headers.authorization.split('bearer ')[1];
            const decoded = jwtDecode(token);
            const conversation = await Message.find({
                $or: [
                    { participant1: decoded.id },
                    { participant2: decoded.id }
                ]
            })
                .populate('participant1', 'name _id username avatar')
                .populate('participant2', 'name _id username avatar');
            res.status(200).json(conversation);
        } catch (error) {
            next(error);
        }
    }

}