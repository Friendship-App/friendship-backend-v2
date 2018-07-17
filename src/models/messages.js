import knex from '../utils/knex';

export const dbUpdateMessages = (chatroomId, userId) =>
  knex
    .del()
    .from('user_unread_messages')
    .where({ chatroomId, userId })
    .then();

export const dbGetMessages = chatroomId =>
  knex
    .select()
    .from('messages')
    .where({ chatroom_id: chatroomId })
    .orderBy('chat_time', 'desc');
