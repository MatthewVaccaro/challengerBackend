const db = require('../../models/basicModel');
const challengeModel = require('../../models/challengesModel');
const helper = require('../../utils/helperFunctions');

function GET_allChallenges() {
	return async (req, res, next) => {
		try {
			//* Find and Validate the game exists
			const findGame = await db.findById(req.params.gameID, 'games');
			helper.checkLength(findGame, "Game doesn't exists", res);
			//* Get all challenges
			const retrieveChallenges = await challengeModel.getChallenges(req.params.gameID);
			helper.checkLength(retrieveChallenges, 'Challenges not found', res);
			return res.status(200).json(retrieveChallenges);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_allChallenges;
