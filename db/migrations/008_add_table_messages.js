/**
 * Add table for messages
 */
exports.up = knex =>
  knex.schema
    .createTableIfNotExists('messages', table => {
      table
        .increments('id')
        .unique()
        .primary();
      table.text('textMessage').notNullable();
      table.timestamp('chatTime');
      table
        .integer('senderId')
        .references('id')
        .inTable('users');
      table
        .integer('chatroomId')
        .references('id')
        .inTable('chatrooms');
    })
    .createTableIfNotExists('unread_messages', table => {
      table.increments('id').primary();
      table
        .integer('messageId')
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE');
      table
        .integer('receiverId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('chatroomId')
        .references('id')
        .inTable('chatrooms')
        .onDelete('CASCADE');
    });

/**
 * Delete the tags table
 */
exports.down = knex => {
  return knex.schema.dropTable('unread_messages').dropTableIfExists('messages');
};
