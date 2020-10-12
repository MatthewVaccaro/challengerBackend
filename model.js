const db = require('./data/config');

async function basicAdd(element, table) {
	return db.insert(element).into(table).then((res) => {
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

function remove(id, table) {
	return db(table).where({ id }) ? db(table).where({ id }).del() : null;
}

function update(id, changes, table) {
	return db(table).where({ id }).update(changes).then((res) => {
		return findById(id, table);
	});
}

module.exports = {
	basicAdd,
	findAll,
	findById,
	remove,
	update
};
