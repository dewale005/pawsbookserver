const {
	UserRegistration,
	encryptpassword,
	Userlogin,
	comparePassword,
	UserUpdate,
} = require('../service/validation');
const User = require('../model/user.model');
const jwt = require('../helpers/jwt');
const jwtDecode = require('jwt-decode');

module.exports = {
	async userRegistration(req, res, next) {
		try {
			const { value, error } = UserRegistration(req.body);
			if (error) {
				res.status(400).json({ message: 'Invalid Credentials' });
			}
			const encryptpass = encryptpassword(value.password);
			const username = await User.findOne({ username: value.username });
			const email = await User.findOne({ email: value.email });
			if (username) {
				return res.status(400).json({ message: 'Username already exist' });
			} else if (email) {
				return res.status(400).json({ message: 'Email already exist' });
			} else {
				const user = await User.create({
					username: value.username,
					email: value.email,
					password: encryptpass,
				});
				const token = jwt.issue({ id: user._id }, '30d');
				res.status(200).json({ user: user._id, token });
			}
		} catch (error) {
			next(error);
		}
	},

	async userlogin(req, res, next) {
		try {
			const { value, error } = Userlogin(req.body);
			if (error) {
				res.status(400).json({ message: 'Invalid Credentials' });
			}
			const user = await User.findOne({ username: value.username });
			if (!user) {
				return res.status(400).json({ message: 'Username does not exist' });
			}

			const password = comparePassword(value.password, user.password);
			if (!password) {
				return res.status(400).json({ message: 'Your password is incorrect' });
			}
			const token = jwt.issue({ id: user._id }, '30d');
			return res.json({ user: user._id, token });
		} catch (error) {
			next(error);
		}
	},

	async userData(req, res, next) {
		try {
			const token = req.headers.authorization.split('bearer ')[1];
			const decoded = jwtDecode(token);
            const user = await User.findOne({ _id: decoded.id })
                .populate('following.user', '_id avatar username name')
                .populate('followers.user', '_id avatar username name');
			if (!user) {
				return res.status(400).json({ message: 'user not found' });
			}
			return res.status(200).json(user);
		} catch (error) {
			next(error);
		}
	},

	async edituserData(req, res, next) {
		try {
			const { value, error } = UserUpdate(req.body);
			if (error) {
				res.status(400).json({ message: 'Invalid Data', error: error.details });
			}
			const token = req.headers.authorization.split('bearer ')[1];
			const decoded = jwtDecode(token);
			const user = await User.findOneAndUpdate({ _id: decoded.id }, value, {
				new: true,
			});
			if (!user) {
				return res.status(400).json({ message: 'No user found' });
			}
			return res.status(200).json(user);
		} catch (error) {
			next(error);
		}
	},

	async allusers(req, res, next) {
		try {
			const user = await User.find().select('_id username email name avatar following followers');
			return res.status(200).json(user);
		} catch (error) {
			next(error);
		}
	},

	async followUser(req, res, next) {
		try {
			const { id } = req.params;
			const token = req.headers.authorization.split('bearer ')[1];
			const decoded = jwtDecode(token);
			const user = await User.findOne({
				_id: decoded.id,
				'following.user': id,
			});
			if (user) {
				await User.updateOne(
					{
						_id: decoded.id,
					},
					{
						$pull: {
							following: {
								user: id,
							},
						},
					},
				);
				await User.updateOne(
					{
						_id: id,
					},
					{
						$pull: {
							followers: {
								user: decoded.id,
							},
						},
					},
				);
				res.status(200).json({message: "User has been unfollowed"});
			} else {
				await User.updateOne(
					{
						_id: decoded.id,
					},
					{
						$push: {
							following: {
								$each: [
									{
										user: id,
									},
								],
								$position: 0,
							},
						},
					},
				);
				await User.updateOne(
					{
						_id: id,
					},
					{
						$push: {
							followers: {
								$each: [
									{
										user: decoded.id,
									},
								],
								$position: 0,
							},
						},
					},
				);
				res
					.status(200)
					.json({ message: "User has been followed" });
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
    },
    
    async acceptUser(req, res, next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }
};
