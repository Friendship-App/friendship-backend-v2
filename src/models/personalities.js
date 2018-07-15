import knex from '../utils/knex';

export const dbGetPersonalities = () => knex.select().from('personalities');

export const dbRegisterPersonalities = userPersonalities =>
  knex.insert(userPersonalities).into('user_personality');
