import knex from '../../utils/knex';

const userListFields = [
  'users.id',
  'users.createdAt',
  'users.lastActive',
  'users.email',
  'users.scope',
  'users.username',
  'users.description',
  'users.mood',
  'users.compatibility',
  'users.active',
  'users.birthyear',
  'users.status',
  'users.image',
];

export const dbGetUsers = () => {
  return knex('users')
    .leftJoin('banned_users', 'banned_users.userId', 'users.id')
    .select(userListFields)
    .count('banned_users.id as isbanned')
    .whereNot('users.scope', 'admin')
    .groupBy('users.id')
    .orderBy('users.id', 'asc');
};
