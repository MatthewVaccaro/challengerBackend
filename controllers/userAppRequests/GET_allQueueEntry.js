const db = require('../../models/basicModel');
const entryModel = require('../../models/entriesModel');
const helper = require('../../utils/helperFunctions');

function GET_allQueueEntry() {
	return async (req, res, next) => {
		try {
			const game = req.params.gameID;

			const retrieveGame = await db.findById(game, 'games');
			helper.checkLength(retrieveGame, 'Game not found', res);

			const retrieveEntries = await entryModel.getEntries(game);
			helper.checkLength(retrieveEntries, 'Entries not found', res);

			return res.status(200).json(retrieveEntries);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = GET_allQueueEntry;
