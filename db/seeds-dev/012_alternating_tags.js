const tagLabels = ['Alternating stuff', 'Other alternating stuff'];

exports.seed = function(knex, Promise) {
  return knex('tags')
    .where('type', 'alternating')
    .delete()
    .then(() =>
      knex('tags').insert(
        tagLabels.map(name => ({
          creatorId: 2,
          name,
          createdAt: new Date(),
          type: 'alternating',
        })),
      ),
    );
};
