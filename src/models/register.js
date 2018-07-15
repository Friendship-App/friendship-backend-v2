import knex from '../utils/knex';

export const dbCheckUsernameAvailability = username =>
  knex
    .count()
    .from('users')
    .whereRaw(knex.raw('LOWER("username") = ?', username));

export const dbCheckEmailAvailability = email =>
  knex
    .count()
    .from('users')
    .whereRaw(knex.raw('LOWER("email") = ?', email));

export const dbCreateUser = userInformation =>
  knex.transaction(trx => {
    return trx
      .insert(userInformation)
      .into('users')
      .then(() => {
        return trx
          .select('id')
          .from('users')
          .orderBy('id', 'desc')
          .then(data => {
            return data[0].id;
          });
      });
  });
