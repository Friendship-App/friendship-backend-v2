exports.up = knex =>
  knex.schema
    /**
     * Users table
     *
     * Contains info on all users in the system
     */
    .createTableIfNotExists('users', table => {
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('lastActive').defaultTo(knex.fn.now());
      table.enum('scope', ['admin', 'user']).notNullable();
      table
        .text('email')
        .notNullable()
        .unique();
      table.boolean('active').defaultTo(false);
      table.text('description');
      table
        .text('username')
        .notNullable()
        .unique();
      table
        .text('avatar')
        .defaultTo(
          'https://s3.eu-west-2.amazonaws.com/friendship-app/avatars/avatar1.png',
        );
      table
        .string('image')
        .defaultTo(
          'https://s3.eu-west-2.amazonaws.com/friendship-app/profile/default.jpg',
        );
      table.text('compatibility');
      table.boolean('enableMatching').defaultTo(false);
      table.integer('birthyear').unsigned();
      table.string('notificationToken');
      table.text('status');
    })
    /**
     * Define a separate table for storing user secrets (such as password hashes).
     *
     * The rationale is:
     *   - Have to explicitly join/query password table to access secrets
     *   - Don't have to filter out secrets in every 'users' table query
     *
     * => Harder to accidentally leak out user secrets
     *
     * You may want to store other user secrets in this table as well.
     */
    .createTableIfNotExists('secrets', table => {
      table
        .integer('ownerId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .primary();
      table.text('password').notNullable();
    })
    .createTableIfNotExists('banned_users', table => {
      table.increments('id').primary();
      table
        .integer('userId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('bannedBy')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.timestamp('endOfBan').defaultTo(null);
      table.text('reason').notNullable();
    });

exports.down = knex =>
  knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('secrets')
    .dropTableIfExists('banned_users');
