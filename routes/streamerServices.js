const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
// Request Controllers
const POST_createGame = require('../controllers/streamerServicesRequests/POST_createGame');
const POST_createChallenge = require('../controllers/streamerServicesRequests/POST_createChallenge');

router.post('/createGame/:streamID', validateToken(), POST_createGame());

router.post('/createChallenge/:gameID', validateToken(), POST_createChallenge());

module.exports = router;
