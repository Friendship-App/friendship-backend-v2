import knex from '../utils/knex';

export const dbGetMoods = () => knex.select().from('moods');
