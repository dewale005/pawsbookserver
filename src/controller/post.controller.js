const { CreatePost } = require('../service/validation');
const jwtDecode = require('jwt-decode');
const Post = require('../model/post.model');
const Like = require('../model/like.model');
const Comment = require('../model/comment.model');
const { date } = require('joi');

module.exports = {
    async create_post(req, res, next) {
		try {
			const { value, error } = CreatePost(req.body);
			if (error) {
				res.status(400).json({ message: error });
			}
			const image = [];
			for (let i = 0; i < req.files.length; i++) {
				console.log(req.files[i].path);
				image.push({ url: req.files[i].path });
			}
			if (image.length === 0) {
				res.status(400).json({ message: 'No Image or videos uploaded' });
			}
			const token = req.headers.authorization.split('bearer ')[1];
			const decoded = jwtDecode(token);
			const data = {
				authur: decoded.id,
				description: value.description,
				posts: image,
			};
			const post = await Post.create(data);
			res.status(200).json(post);
        } catch (error) {
            console.log(error);
			next(error);
		}
	},

	async like_post(req, res, next) {
		try {
			const { id } = req.params;
			const token = req.headers.authorization.split('bearer ')[1];
            const decoded = jwtDecode(token);
            const post = await Post.find({ _id: id})
            const like = await Like.find({ post: id, user: decoded.id });
            const body = {
                post: id,
                user: decoded.id
            }
            if (post.length === 0) {
                res.status(400).json({ message: 'No post found' });
            } else if (like.length > 0) {
                const data = await Like.findOneAndDelete(body);
                await Post.updateOne(
                    {
                        _id: id
                    }, {
                        $pull: {
                            likes: {
                                user: data._id
                            }
                        }
                    }
                )
                res.status(200).json({data, message: "User Unliked"});
            } else {
                const data = await Like.create(body);
                await Post.updateOne(
                    {
                        _id: id
                    }, {
                    $push: {
                        likes: {
                            $each: [
                                {
                                    user: data._id
                                }
                            ],
                            $position: 0
                        }
                    }
                }
                )
                res.status(200).json(data);
            }
		} catch (error) {
			next(error);
		}
    },

    async unlike_post(req, res, next) {
        try {
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async get_post(req, res, next) {
        try {
            const { id } = req.params;
			const token = req.headers.authorization.split('bearer ')[1];
            const decoded = jwtDecode(token);
            const post = await Post.find().sort({ _id: -1 })
                .populate('authur', 'username _id email avatar')
                .populate({ path: 'likes.user', select: 'date user', populate: { path: 'user', model: 'User', select: '_id username name avatar' } })
                .populate({ path: 'comment.user', select: 'created_date description user likes reply', populate: { path: 'user', model: 'User', select: '_id username name avatar' } })
                .select('description posts date_created authur likes comment');
            res.status(200).json(post)
        } catch (error) {
            next(error);
        }
    }
};
