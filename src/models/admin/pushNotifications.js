import knex from '../../utils/knex';

export const dbCreatPushNotification = fields => {
  return knex('push_notifications').insert(fields);
};

export const dbGetPushNotifications = () => {
  return knex('push_notifications')
    .select([
      'push_notifications.id',
      'push_notifications.notification',
      'push_notifications.time',
      'users.username',
    ])
    .leftJoin('users', 'push_notifications.senderId', 'users.id')
    .orderBy('push_notifications.time', 'desc');
};
