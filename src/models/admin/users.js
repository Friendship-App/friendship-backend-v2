import knex from '../../utils/knex';
import { hashPassword } from '../../handlers/register';

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

export const dbGetUsers = username => {
  return knex('users')
    .leftJoin('banned_users', 'banned_users.userId', 'users.id')
    .leftJoin('reports', 'reports.userId', 'users.id')
    .select(userListFields)
    .count('banned_users.id as isbanned')
    .count('reports.id as reports')
    .whereRaw(`LOWER(users.username) LIKE LOWER('%${username}%')`)
    .whereNot('users.scope', 'admin')
    .whereNot('users.email', null)
    .groupBy('users.id')
    .orderBy('users.id', 'asc');
};

export const dbGetUser = userId => {
  return knex.transaction(async trx => {
    return trx('users')
      .leftJoin('banned_users', 'banned_users.userId', 'users.id')
      .leftJoin('reports', 'reports.userId', 'users.id')
      .select(userListFields)
      .count('banned_users.id as isbanned')
      .where('users.id', userId)
      .whereNot('users.scope', 'admin')
      .whereNot('users.email', null)
      .groupBy('users.id')
      .orderBy('users.id', 'asc')
      .then(users => users[0])
      .then(user =>
        trx('reports')
          .select('reports.*')
          .where('reports.userId', user.id)
          .then(reports => {
            user.reports = reports;
            return user;
          }),
      );
  });
};

export const dbToggleAccountActivation = (userId, toggleTo) => {
  return knex
    .update({ active: toggleTo })
    .from('users')
    .where({ id: userId });
};

export const dbEditUser = (userId, payload) => {
  const { username, email, password } = payload;
  console.log(username, email, password);
  return knex.transaction(async trx => {
    if (username || email) {
      await trx
        .update({ username, email })
        .from('users')
        .where({ id: userId })
        .returning('*')
        .then(users => users[0])
        .then(user => user);
    }

    if (password) {
      const hashedPassword = await hashPassword(password);
      await trx
        .update({ password: hashedPassword })
        .from('secrets')
        .where({ ownerId: userId });
    }
  });
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
    await trx
      .del()
      .from('unseen_tags')
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

export const dbGetAllNotificationTokens = () =>
  knex('users')
    .select(['users.notificationToken'])
    .whereNotExists(
      knex
        .select('*')
        .from('banned_users')
        .whereRaw('users.id = banned_users."userId"'),
    )
    .whereNot('notificationToken', null);
