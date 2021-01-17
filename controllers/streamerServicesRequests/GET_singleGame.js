const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function GET_singleGame() {
	return async (req, res, next) => {
		try {
			const validateGame = await db.findById(req.params.gameID, 'games');
			helper.checkLength(validateGame, "Game doesn't exists", res);

			return res.status(200).json(validateGame);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_singleGame;
