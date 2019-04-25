exports.up = knex =>
  knex.schema
    /**
     * Events table
     *
     * Contains info on all events in the system
     */
    .createTableIfNotExists('events', table => {
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('title').notNullable();
      table
        .string('eventImage')
        .defaultTo(
          'https://s3.eu-west-2.amazonaws.com/friendship-app/events/default.jpg',
        );
      table.text('description').notNullable();
      table.text('address').notNullable();
      table
        .integer('hostId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.text('city').notNullable();
      table.text('minParticipants').defaultTo(0);
      table.text('maxParticipants');
      table.text('participantsMix');
      table.timestamp('eventDate').notNullable();
      table.integer('chatroomId').unsigned();
    })
    .createTableIfNotExists('user_event', table => {
      table.increments('id').primary();
      table
        .integer('participantId')
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE');
      table
        .integer('eventId')
        .references('id')
        .inTable('events')
        .notNullable()
        .onDelete('CASCADE');
    });
exports.down = knex =>
  knex.schema.dropTableIfExists('user_event').dropTableIfExists('events');
