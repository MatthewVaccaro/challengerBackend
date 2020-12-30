const db = require('../models/basicModel');
const router = require('express').Router();
const helper = require('../utils/helperFunctions');
const validateToken = require('../middleware/validateToken');

const gamesTable = 'games';
const challengeTable = 'challenges';
const streamerTable = 'streamers';

router.post('/createGame/:streamID', validateToken(), async (req, res, next) => {
	try {
		//* Valdiate Streamer
		const validateStreamer = await db.findById(req.params.streamID, streamerTable);
		helper.checkLength(validateStreamer, "Steamer doesn't exists", res);
		//* Valdiate body contents
		if (!req.body.title || !req.body.artwork) {
			return res.status(400).json({ message: 'No body was posted' });
		}
		//* Valdiate no duplicates
		const findDuplicate = await db.findByAny('title', req.body.title, gamesTable);
		helper.checkUnique(findDuplicate, 'This already exists', res);
		//* Build Obj
		const data = req.body;
		data.streamer_id_fk = req.params.streamID;
		//* Add to table
		const newGame = await db.add(data, gamesTable);
		res.status(201).json(newGame[0]);
	} catch (error) {
		next(error);
	}
});

// Create Challenge Route
router.post('/createChallenge/:gameID', validateToken(), async (req, res, next) => {
	console.log('body', req.body);
	try {
		//* Validate the game exists
		const validateGame = await db.findById(req.params.gameID, gamesTable);
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
		const findDuplicate = await db.findByAny('content', req.body.content, challengeTable);
		helper.checkUnique(findDuplicate, 'This already exists', res);
		//* Build Obj
		const data = req.body;
		data.game_id_fk = req.params.gameID;
		//* Add to table
		const newChallenge = await db.add(data, challengeTable);
		res.status(201).json(newChallenge[0]);
	} catch (error) {
		next(error);
	}
});

// ! ---- Everything below is old and needs to loves ------
// Find All Challenges for one game Route
router.get('/:id', async (req, res, next) => {
	try {
		const retrieve = await db.findByRef(req.params.id, 'challenges_gameRef_id', 'challenges');
		if (retrieve.length === 0) {
			return res.status(400).json("Whoops, that isn't a thing...");
		}
		else {
			res.status(200).json(retrieve);
		}
	} catch (error) {
		next(error);
	}
});

// Delete One Challenge
router.delete('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const retrieve = await db.findById(id, 'challenges');
		if (retrieve.length >= 1) {
			const removal = await db.remove(id, 'challenges');
			res.status(200).json(`${retrieve[0].challengeBrief} was sucsessfully deleted`);
		}
		else {
			res.status(400).json({ message: "That ID doesn't exisit" });
		}
	} catch (error) {
		next(error);
	}
});

router.put('/:id', async (req, res, next) => {
	if (req.body && req.params.id) {
		try {
			const bodyData = req.body;
			const id = req.params.id;
			const retrieve = await db.update(id, bodyData, 'challenges');
			res.status(201).json(retrieve);
		} catch (error) {
			next(error);
		}
	}
	else {
		res.status(400).json('Woah, this is scary. Someone is missing a body!');
	}
});

module.exports = router;
