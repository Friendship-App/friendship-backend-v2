import knex from '../utils/knex';

export const dbGetPersonalities = () => knex.select().from('personalities');

export const dbRegisterPersonalities = userPersonalities =>
  knex.insert(userPersonalities).into('user_personality');

export const dbGetUserPersonalities = userId =>
  knex
    .select('id', 'name')
    .from('user_personality')
    .leftJoin('personalities', 'id', 'personalityId')
    .where({ userId });
