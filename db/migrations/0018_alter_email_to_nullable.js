exports.up = knex => {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      return knex.schema.alterTable('users', t => {
        t.text('email').alter();
      });
    }
  });
};

exports.down = knex =>
  knex.schema.table('users', t =>
    t
      .text('email')
      .notNullable()
      .alter(),
  );
