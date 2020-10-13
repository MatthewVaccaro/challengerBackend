const db = require('../model');
const router = require('express').Router();

router.get('/', (req, res, next) => {
	res.status(200).json('submissions working');
});

router.post('/:gameID/:challengeID', async (req, res, next) => {
	if (!req.params.gameID || !req.params.challengeID) {
		res.status(400).json("Whoops, you're missing something");
	}
	else {
		const data = {
			submission_gameRef_id: req.params.gameID,
			submission_challengeRef_id: req.params.challengeID,
			submissionUsername: req.body.submissionUsername
		};

		const retrieve = await db.add(data, 'submission');
		const joiner = await db.joiner(data.submission_gameRef_id);
		console.log(joiner);
		res.status(201).json(joiner);
	}
});

module.exports = router;
