const db = require('./data/config');

function findAll(table, where) {
	if (where === 'gameStatus') {
		return db(table).where('gameStatus', true);
	}
	else {
		return db(table);
	}
}

function findById(id, table) {
	return db(table).where({ id });
}

async function add(data, table) {
	return db.insert(data).into(table).returning('id').then((res) => {
		console.log(res[0]);
		return findById(res[0], table);
	});
}

function findByRef(id, ref, table) {
	return db(table).where(ref, id);
}

function findByAny(ref1, ref2, table) {
	return db(table).where(ref1, ref2);
}

function remove(id, table) {
	return db(table).where({ id }) ? db(table).where({ id }).del() : null;
}

function update(id, changes, table) {
	return db(table).where({ id }).update(changes).then((res) => {
		return findById(id, table);
	});
}

function joiner(id) {
	return db
		.select(
			'submission.id',
			'games.gameTitle',
			'games.gameArtwork',
			'submission.submissionUsername',
			'submission.submissionComplete',
			'challenges.challengeBrief',
			'challenges.challengeType',
			'submission.submission_gameRef_id',
			'submission.submission_challengeRef_id'
		)
		.from('games')
		.join('submission', { 'games.id': 'submission.submission_gameRef_id' })
		.join('challenges', { 'challenges.id': 'submission.submission_challengeRef_id' })
		.where('submission.submissionComplete', false);
}

module.exports = {
	add,
	findAll,
	findById,
	findByRef,
	findByAny,
	remove,
	update,
	joiner
};
