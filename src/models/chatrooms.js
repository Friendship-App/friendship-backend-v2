import knex from '../utils/knex';
import { merge } from 'lodash';

export const dbGetUserChatroom = userId =>
  knex
    .select('id')
    .from('chatrooms')
    .where('user_creator_id', userId)
    .orWhere('user_receiver_id', userId);

export const dbGetChatrooms = async userId => {
  console.log(userId);
  let chatrooms = await knex
    .select()
    .from('chatrooms')
    .where('user_creator_id', userId)
    .orWhere('user_receiver_id', userId)
    .then(data => data);

  for (let i = 0; i < chatrooms.length; i++) {
    await knex
      .first()
      .select()
      .from('messages')
      .where('chatroom_id', chatrooms[i].id)
      .orderBy('chat_time', 'desc')
      .then(lastMessage => {
        chatrooms[i].lastMessage = lastMessage;
      });

    await knex
      .count()
      .from('user_unread_messages')
      .where('userId', userId)
      .andWhere('chatroomId', chatrooms[i].id)
      .then(
        unreadMessagesCount =>
          (chatrooms[i].unreadMessages = unreadMessagesCount[0].count),
      );
  }

  return chatrooms;
};
