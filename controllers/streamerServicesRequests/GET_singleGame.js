const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function GET_singleGame() {
	return async (req, res, next) => {
		try {
			const findGame = await db.findById(req.params.gameID, 'games');
			helper.checkLength(findGame, "Game doesn't exists", res);

			return res.status(200).json(findGame[0]);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_singleGame;
