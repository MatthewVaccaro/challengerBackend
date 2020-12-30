const db = require('../models/basicModel');
const router = require('express').Router();
const helper = require('../utils/helperFunctions');
const validateToken = require('../middleware/validateToken');

const gamesTable = 'games';
const challengeTable = 'challenges';
const streamerTable = 'streamers';

router.post('/createGame/:streamID', validateToken(), async (req, res, next) => {
	try {
		const validateStreamer = await db.findById(req.params.streamID, streamerTable);
		helper.checkLength(validateStreamer, "Steamer doesn't exist", res);

		const findDuplicate = await db.findByAny('title', req.body.title, gamesTable);
		helper.checkUnique(findDuplicate, 'This already exisits', res);

		const data = req.body;
		data.streamer_id_fk = req.params.streamID;

		const newGame = await db.add(data, gamesTable);
		res.status(201).json(newGame[0]);
	} catch (error) {
		next(error);
	}
});

// ! ---- Everything below is old and needs to loves ------

// Create Challenge Route
router.post('/:id', async (req, res, next) => {
	// Is there content
	if (!req.body.challengeBrief && !req.body.challengeType && !req.params.id) {
		return res.status(400).json('Woah, this is scary. Someone is missing a body!');
	}
	const bodyData = {
		challengeBrief: req.body.challengeBrief,
		challengeType: req.body.challengeType,
		challenges_gameRef_id: req.params.id
	};
	// Is the type correct
	if (bodyData.challengeType !== 'meme') {
		return res.status(400).json("Wait! That's not an acceptable type!");
	}

	// does it exsist
	const validateId = await db.findById(req.params.id, 'games');
	// console.log('---->', validateId);
	if (validateId.length === 0) {
		return res.status(400).json('Sadly, no ID was found :/');
	}

	try {
		const retrieve = await db.add(bodyData, 'challenges');
		res.status(201).json(retrieve);
	} catch (error) {
		next(error);
	}
});

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
