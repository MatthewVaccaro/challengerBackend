const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function POST_queueEntry() {
	return async (req, res, next) => {
		try {
			//* Find and Validate the game exists
			const validateGame = await db.findById(req.params.gameID, 'games');
			helper.checkLength(validateGame, "Game doesn't exists", res);

			if (!req.body.challenge_id_fk) {
				return res.status(400).json({ message: 'Missing info' });
			}

			const retrieveChallenges = await db.findById(req.body.challenge_id_fk, 'challenges');
			helper.checkLength(retrieveChallenges, 'Challenges not found', res);

			const data = {
				challenger: req.body.challenger,
				status: 'started',
				game_id_fk: req.params.gameID,
				challenge_id_fk: req.body.challenge_id_fk,
				startDate: new Date().toISOString()
			};

			const result = await db.add(data, 'queueEntries');
			return res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_queueEntry;
