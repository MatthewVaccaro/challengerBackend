const { table } = require('console');

exports.up = function(knex) {
	return knex.schema
		.createTable('streamers', (table) => {
			table.increments('id');
			table.text('email').notNullable();
			table.text('username').notNullable();
			table.text('password').notNullable();
			table.text('streamLink').notNullable();
			table.text('mainColor').defaultTo('333333');
			table.text('secondaryColor').defaultTo('ffffff');
			table.text('mainTextColor').defaultTo('ffffff');
			table.text('secondaryTextColor').defaultTo('333333');
			table.boolean('live').defaultTo(false);
			table.integer('game_id');
			table.boolean('customChallenges').defaultTo(true);
			table.text('avatar');
		})
		.createTable('games', (table) => {
			table.increments('id');
			table.text('title').unique().notNullable();
			table.text('artwork');
		})
		.createTable('challenges', (table) => {
			table.increments('id');
			table.text('content').unique().notNullable();
			table.string('type').notNullable();
			table.integer('streamer_id_fk').references('id').inTable('streamers');
			table.integer('game_id_fk').references('id').inTable('games');
		})
		.createTable('queueEntries', (table) => {
			table.increments('id');
			table.string('challenger').notNullable();
			table.text('status').notNullable();
			table.integer('game_id_fk').references('id').inTable('games');
			table.integer('streamer_id_fk').references('id').inTable('streamers');
			table.integer('challenge_id_fk').references('id').inTable('challenges');
			table.datetime('startDate');
			table.datetime('endDate');
			table.integer('upvote').defaultTo(0);
		});
};

exports.down = function(knex) {
	return knex.schema
		.dropTableIfExists('queueEntries')
		.dropTableIfExists('challenges')
		.dropTableIfExists('games')
		.dropTableIfExists('streamers');
};
