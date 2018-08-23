exports.up = knex => {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      return knex.schema.alterTable('users', t => {
        t.text('active')
          .defaultTo(true)
          .alter();
      });
    }
  });
};

exports.down = knex => knex.schema.table.dropTableIfExists('users');
