import knex from '../utils/knex';

export const dbUpdateMessages = (chatroomId, receiverId) =>
  knex
    .del()
    .from('unread_messages')
    .where({ chatroomId, receiverId })
    .then();

export const dbGetMessages = chatroomId =>
  knex
    .select()
    .from('messages')
    .where({ chatroomId })
    .orderBy('chatTime', 'desc');

export const dbCreateMessage = fields => {
  return knex('messages')
    .insert(fields)
    .returning('*')
    .then(data => data[0]);
};

export const dbRegisterNewUnreadMessage = fields =>
  knex('unread_messages')
    .insert(fields)
    .then();
