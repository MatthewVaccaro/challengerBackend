const db = require('../model');
const router = require('express').Router();

// Create Game Route
router.post('/', async (req, res, next) => {
	if (!req.body.gameTitle || !req.body.gameArtwork || !req.body.gameGif) {
		return res.status(400).json('Woah, this is scary. Someone is missing a body!');
	}

	const validateDuplicate = await db.findByAny('gameTitle', req.body.gameTitle, 'games');
	if (validateDuplicate.length === 1) {
		console.log(validateDuplicate);
		return res.status(400).json('That game title already exisits!');
	}

	try {
		const bodyData = req.body;
		const retrieve = await db.add(bodyData, 'games');
		res.status(201).json(retrieve);
	} catch (error) {
		next(error);
	}
});

// Find All Games Route
router.get('/', async (req, res, next) => {
	try {
		const retrieve = await db.findAll('games', null);
		res.status(200).json(retrieve);
	} catch (error) {
		next(error);
	}
});

router.get('/gameStatus', async (req, res, next) => {
	try {
		const retrieve = await db.findAll('games', 'gameStatus');
		res.status(200).json(retrieve);
	} catch (error) {
		next(error);
	}
});

// Find Games by Id Route
router.get('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const retrieve = await db.findById(id, 'games');
		if (retrieve.length >= 1) {
			res.status(200).json(retrieve);
		}
		else {
			res.status(400).json("That ID doesn't exisit");
		}
	} catch (error) {
		next(error);
	}
});

// Delete Game by Id
router.delete('/:id', async (req, res, next) => {
	const id = req.params.id;
	try {
		const retrieve = await db.findById(id, 'games');
		if (retrieve.length >= 1) {
			const removal = await db.remove(id, 'games');
			res.status(200).json(`${retrieve[0].gameTitle} was sucsessfully deleted`);
		}
		else {
			res.status(400).json({ message: "That ID doesn't exisit" });
		}
	} catch (error) {
		next(error);
	}
});

// Update Game Route
router.put('/:id', async (req, res, next) => {
	if (req.body && req.params.id) {
		try {
			const bodyData = req.body;
			const id = req.params.id;
			const retrieve = await db.update(id, bodyData, 'games');
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
