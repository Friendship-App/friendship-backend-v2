/**
 * Add table for push notifications
 */
exports.up = knex =>
  knex.schema.createTableIfNotExists('push_notifications', table => {
    table
      .increments('id')
      .unique()
      .primary();
    table.text('title');
    table.text('message').notNullable();
    table.timestamp('time');
    table
      .integer('senderId')
      .references('id')
      .inTable('users');
  });

/**
 * Delete the push notifications table
 */
exports.down = knex =>
  knex.schema.table.dropTableIfExists('push_notifications');
