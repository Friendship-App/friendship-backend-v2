import knex from '../utils/knex';

export const dbGetUsers = () => {
  return knex.select().from('users');
};
