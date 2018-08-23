exports.up = knex => {
  return knex.schema.hasTable('events').then(async exists => {
    if (exists) {
      await knex.schema.alterTable('events', t => {
        t.dropColumn('active');
      });
      return knex.schema.alterTable('events', t => {
        t.boolean('active').defaultTo(true);
      });
    }
  });
};

exports.down = knex => knex.schema.table.dropTableIfExists('events');
