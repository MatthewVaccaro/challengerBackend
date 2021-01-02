const db = require('../../models/basicModel');
const auth = require('../../models/authModel');
const helper = require('../../utils/helperFunctions');

function POST_register() {
	return async (req, res, next) => {
		try {
			const data = req.body;
			let { username, password, email } = data;

			username = helper.lowerCase(username);
			email = helper.lowerCase(email);

			if (!username || !password) {
				return res.status(404).json({ message: 'missing info' });
			}

			const uniqueUsername = await db.findByAny('username', username, 'streamers');
			const uniqueEmail = await db.findByAny('email', email, 'streamers');

			helper.checkUnique(uniqueUsername, 'userName already exisits', res);
			helper.checkUnique(uniqueEmail, 'Email already exisits', res);

			const create = await auth.register(data);
			res.status(201).json(create);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_register;
