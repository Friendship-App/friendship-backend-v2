exports.up = knex => {
  return knex.schema.hasTable('events').then(async exists => {
    if (exists) {
      return knex.schema.alterTable('events', t => {
        t.boolean('active').defaultTo(true);
      });
    }
  });
};

exports.down = knex => knex.schema.table.dropTableIfExists('events');
