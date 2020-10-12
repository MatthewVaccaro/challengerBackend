require('dotenv').config();
const pg = require('pg');

// pg.defaults.ssl = true;

module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: './data/challenges.db3'
		},
		migrations: {
			directory: './data/migrations'
		},
		seeds: { directory: './data/seeds' },
		afterCreate: (conn, done) => {
			// runs after a connection is made to the sqlite engine
			conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
		},
		useNullAsDefault: true
	},
	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tablename: 'challenge_migrations',
			directory: './data/migrations'
		},
		seeds: { directory: './data/seeds' }
	}
};
