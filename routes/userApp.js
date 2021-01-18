const router = require('express').Router();

//User App Request Controllers
const GET_streamer = require('../controllers/userAppRequests/GET_streamer');
const GET_allChallenges = require('../controllers/userAppRequests/GET_allChallenges');
const POST_queueEntry = require('../controllers/userAppRequests/POST_queueEntry');
const GET_allQueueEntry = require('../controllers/userAppRequests/GET_allQueueEntry');
const POST_customChallenge = require('../controllers/userAppRequests/POST_customChallenge');
const PUT_entryUpVote = require('../controllers/userAppRequests/PUT_entryUpVote');

router.get('/:streamer', GET_streamer());

router.get('/allChallenges/streamer/:streamerID/game/:gameID', GET_allChallenges());

router.post('/queueEntry/streamer/:streamerID/game/:gameID', POST_queueEntry());

router.get('/allEntries/streamer/:streamerID/game/:gameID', GET_allQueueEntry());

router.post('/customChallenge/streamer/:streamerID/game/:gameID', POST_customChallenge());

router.put('/entryUpVote/:entryID', PUT_entryUpVote());

// ! Using for testing right now--- delete later -----

// router.put('/updateStreamer/testUser', async (req, res, next) => {
// 	try {
// 		const data = req.body;
// 		console.log('bod', req.body);
// 		const updateSean = await db.update(12, data, 'streamers');
// 		res.status(200).json(updateSean);
// 	} catch (error) {
// 		next(error);
// 	}
// });

module.exports = router;
