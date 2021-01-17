const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
// Request Controllers
const POST_createGame = require('../controllers/streamerServicesRequests/POST_createGame');
const POST_createChallenge = require('../controllers/streamerServicesRequests/POST_createChallenge');
const GET_singleGame = require('../controllers/streamerServicesRequests/GET_singleGame');
const db = require('../models/basicModel');

router.post('/createGame/:streamID', validateToken(), POST_createGame());

router.post('/createChallenge/:gameID', validateToken(), POST_createChallenge());

router.get('/getGame/:gameID', GET_singleGame());

module.exports = router;
