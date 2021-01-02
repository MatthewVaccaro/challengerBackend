const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function POST_createChallenge() {
	return async (req, res, next) => {
		try {
			//* Validate the game exists
			const validateGame = await db.findById(req.params.gameID, 'games');
			helper.checkLength(validateGame, "Game doesn't exists", res);
			//* Validate body exists
			if (!req.body.content || !req.body.type) {
				return res.status(400).json({ message: 'No body was posted' });
			}
			//* Validate type
			if (
				req.body.type != 'meme' &&
				req.body.type != 'troll' &&
				req.body.type != 'difficult' &&
				req.body.type != 'custom'
			) {
				return res.status(400).json({ message: 'type not recognized' });
			}
			//* Validate unique
			const findDuplicate = await db.findByAny('content', req.body.content, 'challenges');
			helper.checkUnique(findDuplicate, 'This already exists', res);
			//* Build Obj
			const data = req.body;
			data.game_id_fk = req.params.gameID;
			//* Add to table
			const newChallenge = await db.add(data, 'challenges');
			res.status(201).json(newChallenge[0]);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_createChallenge;
