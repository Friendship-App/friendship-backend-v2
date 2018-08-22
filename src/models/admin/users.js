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
    .whereNot('users.email', null)
    .groupBy('users.id')
    .orderBy('users.id', 'asc');
};

export const dbToggleAccountActivation = (userId, toggleTo) => {
  return knex
    .update({ active: toggleTo })
    .from('users')
    .where({ id: userId });
};

export const dbDeleteUser = userId => {
  return knex.transaction(async trx => {
    await trx
      .del()
      .from('user_tag')
      .where({ userId });
    await trx
      .del()
      .from('user_event')
      .where({ participantId: userId });
    await trx
      .del()
      .from('user_personality')
      .where({ userId });
    await trx
      .del()
      .from('secrets')
      .where({ ownerId: userId });
    await trx
      .del()
      .from('user_gender')
      .where({ userId });
    await trx
      .del()
      .from('user_location')
      .where({ userId });

    return trx
      .update({
        active: false,
        createdAt: null,
        lastActive: null,
        email: null,
        description: null,
        image: null,
        compatibility: null,
        enableMatching: null,
        birthyear: null,
        notificationToken: null,
        status: null,
        mood: null,
      })
      .from('users')
      .where({ id: userId });
  });
};
