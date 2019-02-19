import knex from '../../utils/knex';

export const dbCreatPushNotification = fields => {
  return knex('push_notifications').insert(fields);
};
