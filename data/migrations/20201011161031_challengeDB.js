const { table } = require('console');

exports.up = function(knex) {
	return knex.schema
		.createTable('games', (table) => {
			table.increments('id');
			table.text('gameTitle').unique().notNullable();
			table.text('gameArtwork');
			table.text('gameGif');
			table.boolean('gameStatus').defaultTo(false);
		})
		.createTable('challenges', (table) => {
			table.increments('id');
			table.text('challengeBrief').unique().notNullable();
			table.string('challengeType').notNullable();
			table.integer('challenges_gameRef_id').references('id').inTable('games');
		})
		.createTable('submission', (table) => {
			table.increments('id');
			table.string('submissionUsername').notNullable();
			table.boolean('submissionComplete').defaultTo(false);
			table.integer('submission_gameRef_id').references('id').inTable('games');
			table.integer('submission_challengeRef_id').references('id').inTable('challenges');
		});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('games').dropTableIfExists('challenges').dropTableIfExists('submission');
};
