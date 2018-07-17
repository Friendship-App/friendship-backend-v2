import knex from '../utils/knex';

export const dbGetUserChatroom = userId =>
  knex
    .select('id')
    .from('chatrooms')
    .where('user_creator_id', userId)
    .orWhere('user_receiver_id', userId);

export const dbGetChatrooms = async userId => {
  let chatrooms = await knex
    .select(
      'id',
      'user_creator_id as creatorId',
      'user_receiver_id as participantId',
      'event as isEvent',
    )
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
        chatrooms[i].lastMessage = lastMessage ? lastMessage : '';
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

    await knex
      .select('id', 'avatar', 'username')
      .from('users')
      .whereIn('id', [chatrooms[i].creatorId, chatrooms[i].participantId])
      .then(
        participantsData => (chatrooms[i].participantsData = participantsData),
      );
  }

  for (let i = chatrooms.length - 1; i > 0; i--) {
    if (!chatrooms[i].lastMessage) {
      chatrooms.splice(i, 1);
    }
  }

  return chatrooms;
};
