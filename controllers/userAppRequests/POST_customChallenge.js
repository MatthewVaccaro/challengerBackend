const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function POST_customChallenge() {
	return async (req, res, next) => {
		try {
			if (!req.params.streamerID && !req.params.gameID) {
				return res.status(400).json({ message: 'Missing streamer and or game ID' });
			}
			//* Validate the streamer exists
			const validateStreamer = await db.findById(req.params.streamerID, 'streamers');
			helper.checkLength(validateStreamer, "Streamer doesn't exists", res);
			//* Find and Validate the game exists
			const validateGame = await db.findById(req.params.gameID, 'games');
			helper.checkLength(validateGame, "Game doesn't exists", res);

			const data = req.body;

			if (!data.content || !data.type || data.type != 'custom') {
				return res.status(400).json({ message: 'Missing info' });
			}

			data.game_id_fk = req.params.gameID;
			data.streamer_id_fk = req.params.streamerID;

			const results = await db.add(data, 'challenges');
			res.status(201).json(results[0]);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_customChallenge;
