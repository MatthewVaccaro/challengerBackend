const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function POST_createGame() {
	return async (req, res, next) => {
		try {
			if (!req.body.title || !req.body.artwork) {
				return res.status(400).json({ message: 'No body was posted' });
			}

			const checkForDuplicates = await db.findByAny('title', req.body.title, 'games');
			helper.checkUnique(checkForDuplicates, 'game already exisits', res);

			const data = req.body;

			const newGame = await db.add(data, 'games');
			res.status(201).json(newGame[0]);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_createGame;
