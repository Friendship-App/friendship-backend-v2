/**
 * Add table for tags
 * And create tabe user_tag (allows a many to many relation)
 * Can be used to send the hash trough e-mail to the user
 */
exports.up = knex =>
  knex.schema
    .createTableIfNotExists('tags', table => {
      table.increments('id').primary();
      table
        .integer('creatorId')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.text('name').unique();
      table.timestamp('createdAt').notNullable();
      table.boolean('active').defaultTo(true);
    })

    .createTableIfNotExists('user_tag', table => {
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('tagId')
        .unsigned()
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE');
      table.boolean('love').defaultTo(true);
      table.primary(['userId', 'tagId']);
    });

/**
 * Delete the tags table
 */
exports.down = knex =>
  knex.schema.dropTableIfExists('user_tag').dropTableIfExists('tags');
