import knex from '../utils/knex';

export const dbGetInterests = () =>
  knex
    .select()
    .from('tags')
    .where('category', 2);

export const dbGetActivities = () =>
  knex
    .select()
    .from('tags')
    .where('category', 1);

export const dbRegisterTags = userTags =>
  knex.insert(userTags).into('user_tag');
