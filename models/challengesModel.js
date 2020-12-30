const db = require('../data/config');

function getChallenges(id) {
	return db
		.select('challenges.id', 'challenges.content', 'challenges.type', 'games.id', 'games.title')
		.from('games')
		.join('challenges', { 'games.id': 'challenges.game_id_fk' })
		.where({ 'challenges.game_id_fk': id });
}

module.exports = { getChallenges };
