import knex from '../utils/knex';

export const dbGetUserChatroom = userId =>
  knex
    .select('id')
    .from('chatrooms')
    .where('user_creator_id', userId)
    .orWhere('user_receiver_id', userId);
