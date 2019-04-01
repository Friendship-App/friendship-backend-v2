import { get } from 'lodash';
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

const getEventTitle = async chatroomId =>
  await knex('events')
    .select('title')
    .where('chatroomId', chatroomId)
    .then(resp => get(resp, ['0', 'title']));

const getChatroomReceiversNotificationToken = async (senderId, chatroomId) =>
  await knex('user_chatroom')
    .leftJoin('users', 'users.id', 'user_chatroom.participantId')
    .select('users.notificationToken')
    .where('user_chatroom.chatroomId', chatroomId)
    .andWhereNot('users.id', senderId);

const getSenderName = async senderId =>
  await knex('users')
    .select('username')
    .where('id', senderId)
    .then(resp => resp[0].username);

export const dbGetDataForMessageNotification = async (senderId, chatroomId) => {
  const notificationTokens = await getChatroomReceiversNotificationToken(
    senderId,
    chatroomId,
  );
  const senderName = await getSenderName(senderId);
  const eventTitle = await getEventTitle(chatroomId);

  return { notificationTokens, senderName, eventTitle };
};
