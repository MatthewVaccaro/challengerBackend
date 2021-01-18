const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
// Request Controllers
const POST_createGame = require('../controllers/streamerServicesRequests/POST_createGame');
const POST_createChallenge = require('../controllers/streamerServicesRequests/POST_createChallenge');
const GET_singleGame = require('../controllers/streamerServicesRequests/GET_singleGame');
const db = require('../models/basicModel');

router.post('/createGame', POST_createGame());

router.post('/createChallenge/streamer/:streamerID/game/:gameID', validateToken(), POST_createChallenge());

router.get('/getGame/:gameID', GET_singleGame());

router.put('/streamer/:streamID', async (req, res, next) => {
	try {
		const updateStreamer = await db.update(req.params.streamID, req.body, 'streamers');

		return res.status(200).json(updateStreamer);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
