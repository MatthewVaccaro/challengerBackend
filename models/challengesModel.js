const db = require('../data/config');

function getChallenges(streamID, gameID) {
	return db
		.select('challenges.id', 'challenges.content', 'challenges.type', 'games.title', 'games.artwork')
		.from('games')
		.join('challenges', { 'games.id': 'challenges.game_id_fk' })
		.where({ 'challenges.game_id_fk': gameID, 'challenges.streamer_id_fk': streamID });
}

module.exports = { getChallenges };
