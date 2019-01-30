exports.up = function(knex, Promise) {
  return knex.schema.table('tags', function(table) {
    table.enum('type', ['base', 'alternating']).defaultTo('base');
  });
};

exports.down = function(knex, Promise) {
  return knex('tags')
    .where('type', 'alternating')
    .delete()
    .then(() =>
      knex.schema.table('tags', function(table) {
        table.dropColumn('type');
      }),
    );
};
