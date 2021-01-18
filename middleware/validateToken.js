const jwt = require('jsonwebtoken');
require('dotenv').config();

function validateToken() {
	return async (req, res, next) => {
		try {
			const token = req.headers.authorization;
			if (!token) {
				return res.status(400).json({ message: 'Missing credentials - Alpha' });
			}

			jwt.verify(token, process.env.TOKEN, (err, decode) => {
				if (err) {
					res.status(400).json({ message: 'Missing credentials - Beta', error: err });
				}
			});

			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = validateToken;
