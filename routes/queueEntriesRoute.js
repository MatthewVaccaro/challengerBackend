const db = require('../controllers/basicController');
const router = require('express').Router();

router.post('/:gameID/:challengeID', async (req, res, next) => {
	if (!req.params.gameID || !req.params.challengeID) {
		return res.status(400).json("Whoops, you're missing something");
	}

	const data = {
		submission_gameRef_id: req.params.gameID,
		submission_challengeRef_id: req.params.challengeID,
		submissionUsername: req.body.submissionUsername
	};

	const validateGameID = await db.findById(data.submission_gameRef_id, 'games');
	const validateChallengeID = await db.findById(data.submission_challengeRef_id, 'challenges');

	if (validateGameID.length === 0 || validateChallengeID.length === 0) {
		return res.status(400).json("We can't seem to find that");
	}

	try {
		const retrieve = await db.add(data, 'submission');
		res.status(201).json(retrieve);
	} catch (error) {
		next(error);
	}
});

router.get('/', async (req, res, next) => {
	try {
		const retrieve = await db.joiner();
		res.status(200).json(retrieve);
	} catch (error) {
		next(error);
	}
});

router.put('/:id', async (req, res, next) => {
	const validateID = await db.findById(req.params.id, 'submission');

	if (validateID.length === 0) {
		return res.status(400).json("We can't seem to find that ID");
	}
	try {
		const changes = req.body;
		const retrieve = await db.update(req.params.id, changes, 'submission');
		res.status(200).json(retrieve);
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	const retrieve = await db.findById(req.params.id, 'submission');

	if (retrieve.length === 0) {
		return res.status(400).json("We can't seem to find that ID");
	}

	try {
		const removal = await db.remove(req.params.id, 'submission');
		res.status(200).json(`${retrieve[0].submissionUsername}'s was sucsessfully deleted`);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
