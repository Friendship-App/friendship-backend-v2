import knex from '../utils/knex';

export const dbInsertAppFeedback = (feedback, userId) => {
  return knex('feedbacks')
    .insert({ description: feedback, userId })
    .returning('*');
};
