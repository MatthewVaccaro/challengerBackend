const express = require('express');
// Routes
const gameRoute = require('./routes/gamesRoute');
const challengeRoute = require('./routes/challengesRoute');
const submissionRoute = require('./routes/submissionsRoute');

const server = express();

server.use(express.json());
server.use('/api/games', gameRoute);
server.use('/api/challenges', challengeRoute);
server.use('/api/submissions', submissionRoute);

server.get('/', (req, res) => {
	res.status(200).json({ message: 'Node Challenger Backend' });
});

module.exports = server;
