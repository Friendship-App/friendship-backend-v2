/**
 * Add table for feedbacks
 * And link it to a user
 */
exports.up = knex =>
  knex.schema
    .dropTableIfExists('feedback_surveyOption')
    .then(() => knex.schema.dropTableIfExists('surveyOptions'))
    .then(() => knex.schema.dropTableIfExists('feedbacks'))
    .then(() =>
      knex.schema.createTableIfNotExists('feedbacks', table => {
        table.increments('id').primary();
        table
          .integer('userId')
          .references('id')
          .inTable('users')
          .onDelete('SET NULL');
        table.text('description');
      }),
    );

exports.down = knex => knex.schema.dropTableIfExists('feedbacks');
