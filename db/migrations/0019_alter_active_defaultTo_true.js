exports.up = knex => {
  return knex.schema.hasTable('users').then(async exists => {
    if (exists) {
      await knex.schema.alterTable('users', t => {
        t.dropColumn('active');
      });
      return knex.schema.alterTable('users', t => {
        t.boolean('active').defaultTo(true);
      });
    }
  });
};

exports.down = knex =>
  knex.schema.alterTable('users', t =>
    t
      .boolean('active')
      .defaultTo(false)
      .alter(),
  );
