import knex from '../utils/knex';

export const dbRegisterPassword = secrets =>
  knex.insert(secrets).into('secrets');
