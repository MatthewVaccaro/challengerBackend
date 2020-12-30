const db = require('../models/basicModel');
const entryModel = require('../models/entriesModel');
const router = require('express').Router();
const helper = require('../utils/helperFunctions');

router.get('/:streamer', async (req, res, next) => {
	try {
		const streamer = req.params.streamer;

		const retrieveUser = await db.findByAny('username', streamer, 'streamers');
		if (retrieveUser.length === 0) {
			return res.status(400).json({ message: 'Streamer not found' });
		}
		delete retrieveUser[0].password;

		res.status(200).json(retrieveUser);
	} catch (error) {
		next(error);
	}
});

router.get('/allChallenges/:streamer/:gameId', async (req, res, next) => {
	try {
		const streamer = req.params.streamer; //obj
		const game = req.params.gameId; // Int

		const retrieveUser = await db.findByAny('username', streamer, 'streamers');
		helper.checkLength(retrieveUser, 'Streamer not found', res);
		delete retrieveUser[0].password;

		const retrieveGame = await db.findById(game, 'games');
		helper.checkLength(retrieveGame, 'Game not found', res);

		const retrieveChallenges = await db.findByRef(game, 'game_id_fk', 'challenges');
		helper.checkLength(retrieveChallenges, 'Challenges not found', res);

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
		helper.checkLength(retrieveGame, 'Game not found', res);

		const retrieveChallenges = await db.findById(challenge_id_fk, 'challenges');
		helper.checkLength(retrieveChallenges, 'Challenges not found', res);

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
		helper.checkLength(retrieveGame, 'Game not found', res);

		const retrieveEntries = await entryModel.getEntries(game);
		helper.checkLength(retrieveEntries, 'Entries not found', res);

		res.status(200).json(retrieveEntries);
	} catch (error) {
		next(error);
	}
});
router.post('/customChallenge/:game_id', async (req, res, next) => {
	try {
		const game = req.params.game_id;
		const data = req.body;
		const { content, type } = data;

		const retrieveGame = await db.findById(game, 'games');
		helper.checkLength(retrieveGame, 'Game not found', res);

		if (!content || !type || type != 'custom') {
			return res.status(400).json({ message: 'Missing info' });
		}

		data.game_id_fk = game;

		const results = await db.add(data, 'challenges');
		res.status(201).json(results);
	} catch (error) {
		next(error);
	}
});

router.put('/entryUpVote/:etnryID', async (req, res, next) => {
	try {
		const id = req.params.etnryID;

		if (!req.body.vote) {
			res.status(400).json({ message: 'missing vote key' });
		}

		const retrieveEntry = await db.findById(id, 'queueEntries');
		helper.checkLength(retrieveEntry, 'Entry not found', res);

		if (retrieveEntry[0].status != 'started') {
			return res.status(400).json({ message: "Entry isn't in the queue" });
		}

		if (req.body.vote === 'plus') {
			retrieveEntry[0].upvote++;
		}

		if (req.body.vote === 'minus') {
			retrieveEntry[0].upvote--;
		}

		const update = await db.update(id, retrieveEntry[0], 'queueEntries');
		const results = await entryModel.entryById(id);
		res.status(200).json(results);
	} catch (error) {
		next(error);
	}
});

// ! Using for testing right now--- delete later -----

router.put('/updateStreamer/testUser', async (req, res, next) => {
	try {
		const data = req.body;
		console.log('bod', req.body);
		const updateSean = await db.update(12, data, 'streamers');
		res.status(200).json(updateSean);
	} catch (error) {
		next(error);
	}
});

module.exports = router;