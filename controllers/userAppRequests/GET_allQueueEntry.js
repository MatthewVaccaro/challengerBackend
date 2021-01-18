const db = require('../../models/basicModel');
const entryModel = require('../../models/entriesModel');
const helper = require('../../utils/helperFunctions');

function GET_allQueueEntry() {
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

			const retrieveEntries = await entryModel.getEntries(req.params.streamerID, req.params.gameID);
			helper.checkLength(retrieveEntries, 'Entries not found', res);

			return res.status(200).json(retrieveEntries);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_allQueueEntry;
