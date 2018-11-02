import knex from '../../utils/knex';

export const dbGetTotalFeedbacks = () => {
  return knex('feedbacks')
    .select(['feedbacks.id', 'feedbacks.description', 'users.username'])
    .leftJoin('users', 'feedbacks.userId', 'users.id')
    .groupBy('feedbacks.id', 'users.username')
    .orderBy('feedbacks.id', 'DESC');
};
