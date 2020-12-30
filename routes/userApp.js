const db = require('../models/basicModel');
const challengeModel = require('../models/challengesModel');
const entryModel = require('../models/entriesModel');
const router = require('express').Router();
const helper = require('../utils/helperFunctions');

const gamesTable = 'games';
const challengeTable = 'challenges';
const streamerTable = 'streamers';

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

router.get('/allChallenges/:gameID', async (req, res, next) => {
	try {
		//* Find and Validate the game exists
		const findGame = await db.findById(req.params.gameID, gamesTable);
		helper.checkLength(findGame, "Game doesn't exists", res);
		//* Get all challenges
		const retrieveChallenges = await challengeModel.getChallenges(req.params.gameID);
		helper.checkLength(retrieveChallenges, 'Challenges not found', res);
		res.status(200).json(retrieveChallenges);
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
