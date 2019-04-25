exports.up = knex =>
  knex.schema
    .createTableIfNotExists('chatrooms', table => {
      table.increments('id').primary();
      table
        .integer('creatorId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.boolean('isEventChatroom').defaultTo(false);
    })
    .createTableIfNotExists('user_chatroom', table => {
      table.increments('id').primary();
      table
        .integer('chatroomId')
        .references('id')
        .inTable('chatrooms')
        .onDelete('CASCADE');
      table
        .integer('participantId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    });

exports.down = knex =>
  knex.schema.dropTableIfExists('user_chatroom').dropTableIfExists('chatrooms');
