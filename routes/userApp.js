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

		return res.status(200).json(retrieveUser);
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
		return res.status(200).json(retrieveChallenges);
	} catch (error) {
		next(error);
	}
});

router.post('/queueEntry/:gameID', async (req, res, next) => {
	try {
		//* Find and Validate the game exists
		const validateGame = await db.findById(req.params.gameID, gamesTable);
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
		console.log(result);

		return res.status(201).json(result);
	} catch (error) {
		next(error);
	}
});
router.get('/allEntries/:gameID', async (req, res, next) => {
	try {
		const game = req.params.gameID;

		const retrieveGame = await db.findById(game, 'games');
		console.log('retrieveGame', retrieveGame);
		helper.checkLength(retrieveGame, 'Game not found', res);

		const retrieveEntries = await entryModel.getEntries(game);
		helper.checkLength(retrieveEntries, 'Entries not found', res);

		return res.status(200).json(retrieveEntries);
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
