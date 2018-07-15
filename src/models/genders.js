import knex from '../utils/knex';

export const dbRegisterGenders = userGenders =>
  knex.insert(userGenders).into('user_gender');
