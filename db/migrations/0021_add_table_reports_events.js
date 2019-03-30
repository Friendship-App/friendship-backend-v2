exports.up = knex =>
  knex.schema.createTableIfNotExists('event_reports', table => {
    table.increments('id').primary();
    table
      .integer('eventId')
      .references('id')
      .inTable('events')
      .onDelete('CASCADE');
    table.text('description').notNullable();
    table.timestamp('createdAt').notNullable();
    table
      .integer('reported_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });

exports.down = knex => knex.schema.dropTableIfExists('event_reports');
