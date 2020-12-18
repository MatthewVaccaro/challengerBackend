const db = require('../controllers/basicController');
const router = require('express').Router();
const checkLength = require('../utils/helperFunctions');

router.get('/:streamer', async (req, res, next) => {
	const streamer = req.params.streamer;

	const retrieveUser = await db.findByAny('username', streamer, 'streamers');
	if (retrieveUser.length === 0) {
		return res.status(400).json({ message: 'Streamer not found' });
	}
	delete retrieveUser[0].password;

	res.status(200).json(retrieveUser);
});

router.get('/allChallenges/:streamer/:gameId', async (req, res, next) => {
	try {
		const streamer = req.params.streamer; //obj
		const game = req.params.gameId; // Int

		const retrieveUser = await db.findByAny('username', streamer, 'streamers');
		checkLength(retrieveUser, 'Streamer not found', res);
		delete retrieveUser[0].password;

		const retrieveGame = await db.findById(game, 'games');
		checkLength(retrieveGame, 'Game not found', res);

		const retrieveChallenges = await db.findByRef(game, 'game_id_fk', 'challenges');
		checkLength(retrieveChallenges, 'Challenges not found', res);

		const results = {
			streamer: retrieveUser[0],
			game: retrieveGame[0],
			challenges: retrieveChallenges
		};

		res.status(200).json(results);
	} catch (error) {
		next(error);
	}
});

router.post('/queueEntry', async (req, res, next) => {
	try {
		const data = req.body;
		const { game_id_fk, challenge_id_fk } = data;

		if (!game_id_fk || !challenge_id_fk) {
			res.status(400).json({ message: 'Missing FKs' });
		}

		const retrieveGame = await db.findById(game_id_fk, 'games');
		checkLength(retrieveGame, 'Game not found', res);

		const retrieveChallenges = await db.findById(challenge_id_fk, 'challenges');
		checkLength(retrieveChallenges, 'Challenges not found', res);

		data.status = 'rejected';

		const result = await db.add(data, 'queueEntries');

		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
});
router.get('/allEntries/:game_id', async (req, res, next) => {
	try {
		const game = req.params.game_id;

		const retrieveGame = await db.findById(game, 'games');
		checkLength(retrieveGame, 'Game not found', res);

		const retrieveEntries = await db.getEntries(game);
		checkLength(retrieveEntries, 'Entries not found', res);

		res.status(200).json(retrieveEntries);
	} catch (error) {
		next(error);
	}
});

// Create Game Route
// router.post('/', async (req, res, next) => {
// 	if (!req.body.gameTitle || !req.body.gameArtwork || !req.body.gameGif) {
// 		return res.status(400).json('Woah, this is scary. Someone is missing a body!');
// 	}

// 	const validateDuplicate = await db.findByAny('gameTitle', req.body.gameTitle, 'games');
// 	if (validateDuplicate.length === 1) {
// 		return res.status(400).json('That game title already exisits!');
// 	}

// 	try {
// 		const bodyData = req.body;
// 		const retrieve = await db.add(bodyData, 'games');
// 		res.status(201).json(retrieve);
// 	} catch (error) {
// 		next(error);
// 	}
// });

// // Find All Games Route
// router.get('/', async (req, res, next) => {
// 	try {
// 		const retrieve = await db.findAll('games', null);
// 		res.status(200).json(retrieve);
// 	} catch (error) {
// 		next(error);
// 	}
// });

// router.get('/gameStatus', async (req, res, next) => {
// 	try {
// 		const retrieve = await db.findAll('games', 'gameStatus');
// 		res.status(200).json(retrieve);
// 	} catch (error) {
// 		next(error);
// 	}
// });

// // Find Games by Id Route
// router.get('/:id', async (req, res, next) => {
// 	const id = req.params.id;
// 	try {
// 		const retrieve = await db.findById(id, 'games');
// 		if (retrieve.length >= 1) {
// 			res.status(200).json(retrieve);
// 		}
// 		else {
// 			res.status(400).json("That ID doesn't exisit");
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// });

// // Delete Game by Id
// router.delete('/:id', async (req, res, next) => {
// 	const id = req.params.id;
// 	try {
// 		const retrieve = await db.findById(id, 'games');
// 		if (retrieve.length >= 1) {
// 			const removal = await db.remove(id, 'games');
// 			res.status(200).json(`${retrieve[0].gameTitle} was sucsessfully deleted`);
// 		}
// 		else {
// 			res.status(400).json({ message: "That ID doesn't exisit" });
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// });

// // Update Game Route
// router.put('/:id', async (req, res, next) => {
// 	if (req.body && req.params.id) {
// 		try {
// 			const bodyData = req.body;
// 			const id = req.params.id;
// 			const retrieve = await db.update(id, bodyData, 'games');
// 			res.status(201).json(retrieve);
// 		} catch (error) {
// 			next(error);
// 		}
// 	}
// 	else {
// 		res.status(400).json('Woah, this is scary. Someone is missing a body!');
// 	}
// });

module.exports = router;
