const express = require('express');
const userRouter = express.Router();
const Passport = require('passport');
const {
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
	get_chatList
} = require('../controller');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		const name = new Date().toISOString() + file.originalname;
		// console.log(req.params, file.originalname.split('.')[1]);
		cb(null, name);
	},
});

const upload = multer({ storage: storage });

/* GET users listing. */
userRouter.post('/register', userRegistration);
userRouter.post('/login', userlogin);
userRouter.get(
	'/',
	Passport.authenticate('jwt', { session: false }),
	allusers,
);
userRouter.get(
	'/profile',
	Passport.authenticate('jwt', { session: false }),
	userData,
);
userRouter.put(
	'/profile',
	Passport.authenticate('jwt', { session: false }),
	edituserData,
);
userRouter.post(
	'/post',
	upload.array('image'),
	Passport.authenticate('jwt', { session: false }),
	create_post,
);
userRouter.post(
	'/like/:id',
	Passport.authenticate('jwt', { session: false }),
	like_post,
);
userRouter.post(
	'/follow/:id',
	Passport.authenticate('jwt', { session: false }),
	followUser,
);
userRouter.post(
	'/comment/:id',
	Passport.authenticate('jwt', { session: false }),
	create_comment,
);
userRouter.post(
	'/chat/:reciever',
	Passport.authenticate('jwt', { session: false }),
	chat_with_user,
);
userRouter.get(
	'/chat/:id',
	Passport.authenticate('jwt', { session: false }),
	get_all_messages,
);
userRouter.get(
	'/chat',
	Passport.authenticate('jwt', { session: false }),
	get_chatList,
);
userRouter.get(
	'/post',
	Passport.authenticate('jwt', { session: false }),
	get_post,
);

module.exports = userRouter;
