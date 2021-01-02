const express = require('express');
const cors = require('cors');
// Routes
const auth = require('./routes/auth');
const userApp = require('./routes/userApp');
const streamerServices = require('./routes/streamerServices');

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/auth', auth);
server.use('/api/userApp', userApp);
server.use('/api/streamerServices', streamerServices);

server.get('/', (req, res) => {
	res.status(200).json({ message: 'Node Challenger Backend' });
});

module.exports = server;
