const db = require('./data/config');

async function add(data, table) {
	return db.insert(data).into(table).then((res) => {
		const id = res[0];
		return db(table).where({ id });
	});
}

function findAll(table) {
	return db(table);
}

function findById(id, table) {
	return db(table).where({ id });
}

function findByRef(id, ref, table) {
	return db(table).where(ref, id);
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
			'games.gameTitle',
			'games.gameArtwork',
			'submission.submissionUsername',
			'challenges.challengeBrief',
			'challenges.challengeType'
		)
		.from('games')
		.join('submission', { 'games.id': 'submission.submission_gameRef_id' })
		.join('challenges', { 'challenges.id': 'submission.submission_challengeRef_id' });
}

module.exports = {
	add,
	findAll,
	findById,
	findByRef,
	remove,
	update,
	joiner
};
