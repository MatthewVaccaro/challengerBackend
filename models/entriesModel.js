const db = require('../data/config');

function getEntries(streamID, gameID) {
	return db
		.select(
			'challenges.id as challenge_id',
			'challenges.content',
			'challenges.type',
			'queueEntries.id as entry_id',
			'queueEntries.challenger',
			'queueEntries.status',
			'queueEntries.upvote',
			'queueEntries.startDate',
			'queueEntries.endDate'
		)
		.from('challenges')
		.join('queueEntries', { 'challenges.id': 'queueEntries.challenge_id_fk' })
		.orderBy('queueEntries.upvote', 'desc')
		.where({
			'queueEntries.streamer_id_fk': streamID,
			'queueEntries.game_id_fk': gameID,
			'queueEntries.status': 'started'
		});
}

function entryById(id) {
	return db
		.select(
			'challenges.id as challenge_id',
			'challenges.content',
			'challenges.type',
			'queueEntries.id as entry_id',
			'queueEntries.challenger',
			'queueEntries.status',
			'queueEntries.upvote',
			'queueEntries.startDate',
			'queueEntries.endDate'
		)
		.from('challenges')
		.join('queueEntries', { 'challenges.id': 'queueEntries.challenge_id_fk' })
		.where({ 'queueEntries.id': id, 'queueEntries.status': 'started' });
}

module.exports = { getEntries, entryById };
