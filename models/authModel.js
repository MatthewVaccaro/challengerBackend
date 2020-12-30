const db = require('../data/config');
const bcrypt = require('bcrypt');

async function register(obj) {
	obj.password = await bcrypt.hash(obj.password, 10);
	return db.insert(obj).into('streamers').returning('id').then((res) => {
		return db('streamers').select('id', 'username', 'email').where('id', res[0]);
	});
}

function findUser(ref1, ref2, table) {
	return db(table).where(ref1, ref2).then((res) => {
		return res[0];
	});
}

module.exports = {
	register,
	findUser
};
