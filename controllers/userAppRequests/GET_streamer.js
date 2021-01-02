const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function GET_streamer() {
	return async (req, res, next) => {
		try {
			const streamer = req.params.streamer;

			const retrieveUser = await db.findByAny('username', streamer, 'streamers');
			helper.checkLength(retrieveUser, 'Streamer not found', res);
			delete retrieveUser[0].password;

			return res.status(200).json(retrieveUser);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_streamer;
