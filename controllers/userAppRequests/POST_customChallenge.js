const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function POST_customChallenge() {
	return async (req, res, next) => {
		try {
			const game = req.params.game_id;
			const data = req.body;

			const retrieveGame = await db.findById(game, 'games');
			helper.checkLength(retrieveGame, 'Game not found', res);

			if (!data.content || !data.type || data.type != 'custom') {
				return res.status(400).json({ message: 'Missing info' });
			}

			data.game_id_fk = game;

			const results = await db.add(data, 'challenges');
			res.status(201).json(results);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_customChallenge;
