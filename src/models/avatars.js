import knex from '../utils/knex';

export const dbGetAvatars = () => knex.select().from('avatars');
