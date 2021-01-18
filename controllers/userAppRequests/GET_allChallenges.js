const db = require('../../models/basicModel');
const challengeModel = require('../../models/challengesModel');
const helper = require('../../utils/helperFunctions');

function GET_allChallenges() {
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
			//* Get all challenges
			const retrieveChallenges = await challengeModel.getChallenges(req.params.streamerID, req.params.gameID);
			helper.checkLength(retrieveChallenges, 'Challenges not found', res);
			return res.status(200).json(retrieveChallenges);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_allChallenges;
