import knex from '../utils/knex';

export const dbGetUsers = () => {
  return knex.select().from('users');
};

export const dbUserIsBanned = user => {
  return knex('banned_users')
    .where({ user_id: user.id })
    .countDistinct('user_id')
    .then(res => res[0].count > 0);
};
