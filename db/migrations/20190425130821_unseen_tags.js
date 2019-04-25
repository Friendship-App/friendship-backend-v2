exports.up = knex => {
  knex.schema.createTableIfNotExists('unseen_tags', table => {
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
    table.primary(['userId', 'tagId']);
  });
};

exports.down = knex => {
  knex.schema.table.table.dropTableIfExists('unseen_tags');
};
