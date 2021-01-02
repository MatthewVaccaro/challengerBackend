const db = require('../../models/basicModel');
const helper = require('../../utils/helperFunctions');

function POST_createGame() {
	return async (req, res, next) => {
		try {
			//* Valdiate Streamer
			const validateStreamer = await db.findById(req.params.streamID, 'streamers');
			helper.checkLength(validateStreamer, "Steamer doesn't exists", res);
			//* Valdiate body contents
			if (!req.body.title || !req.body.artwork) {
				return res.status(400).json({ message: 'No body was posted' });
			}
			//* Valdiate no duplicates
			const findDuplicate = await db.findByAny('title', req.body.title, 'games');
			helper.checkUnique(findDuplicate, 'This already exists', res);
			//* Build Obj
			const data = req.body;
			data.streamer_id_fk = req.params.streamID;
			//* Add to table
			const newGame = await db.add(data, 'games');
			res.status(201).json(newGame[0]);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = POST_createGame;
