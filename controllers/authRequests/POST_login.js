const auth = require('../../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function POST_login() {
	return async (req, res, next) => {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).json({ message: 'Missing information' });
			}

			const foundUser = await auth.findUser('email', email, 'streamers');
			if (foundUser.length === 0) {
				return res.status(400).json({ message: "This user doesn't exisit" });
			}

			const validatePassword = await bcrypt.compareSync(password, foundUser.password);
			if (!validatePassword) {
				return res.status(400).json({ message: 'wrong password or email address' });
			}

			const payload = {
				id: foundUser.id,
				email: foundUser.email
			};

			const token = jwt.sign(payload, process.env.TOKEN);

			return res.status(200).json({
				message: `Welcome ${foundUser.username}`,
				token: token
			});
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_login;
