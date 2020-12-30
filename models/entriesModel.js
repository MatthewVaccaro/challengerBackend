const db = require('../data/config');

function getEntries(id) {
	return db
		.select(
			'challenges.id',
			'challenges.content',
			'challenges.type',
			'queueEntries.id',
			'queueEntries.challenger',
			'queueEntries.status',
			'queueEntries.upvote'
		)
		.from('challenges')
		.join('queueEntries', { 'challenges.id': 'queueEntries.challenge_id_fk' })
		.orderBy('queueEntries.upvote', 'desc')
		.where({ 'challenges.game_id_fk': id, 'queueEntries.status': 'started' });
}

function entryById(id) {
	return db
		.select(
			'challenges.id',
			'challenges.content',
			'challenges.type',
			'queueEntries.id',
			'queueEntries.challenger',
			'queueEntries.status',
			'queueEntries.upvote'
		)
		.from('challenges')
		.join('queueEntries', { 'challenges.id': 'queueEntries.challenge_id_fk' })
		.where({ 'queueEntries.id': id, 'queueEntries.status': 'started' });
}

module.exports = { getEntries, entryById };
