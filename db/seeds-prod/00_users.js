// 'foobar'
const dummyPassword =
  '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

exports.seed = knex =>
  knex('users')
    // Generate one test admin user
    .insert(
      {
        active: true,
        email: 'friendshipapp@outlook.com',
        scope: 'admin',
      },
      'id',
    )
    .then(ids => ids[0]) // Return first (only) user id
    // Set admin user password to 'foobar'
    .then(ownerId =>
      knex('secrets').insert({
        ownerId,
        password:
          '$2y$10$KtW/L85Uzk6t2meyIRBu0.IabcRcdNER0GGXoMdNabmvLFOrIHXuq',
      }),
    );
