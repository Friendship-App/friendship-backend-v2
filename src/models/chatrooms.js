import knex from '../utils/knex';

export const dbGetUserChatroom = userId =>
  knex
    .select('chatrooms.id')
    .from('chatrooms')
    .leftJoin('user_chatroom', 'chatroomId', 'chatrooms.id')
    .where('participantId', userId);

export const dbGetChatrooms = async userId => {
  let chatrooms = await knex
    .select(
      'chatrooms.id as chatroomId',
      'chatrooms.creatorId',
      'chatrooms.isEventChatroom',
    )
    .from('chatrooms')
    .leftJoin('user_chatroom', 'user_chatroom.chatroomId', 'chatrooms.id')
    .where('user_chatroom.participantId', userId)
    .then(data => data);

  for (let i = 0; i < chatrooms.length; i++) {
    await knex
      .first()
      .select()
      .from('messages')
      .where('chatroomId', chatrooms[i].chatroomId)
      .orderBy('chatTime', 'desc')
      .then(lastMessage => {
        chatrooms[i].lastMessage = lastMessage ? lastMessage : '';
      });

    await knex
      .count()
      .from('unread_messages')
      .where('receiverId', userId)
      .andWhere('chatroomId', chatrooms[i].chatroomId)
      .then(
        unreadMessagesCount =>
          (chatrooms[i].unreadMessages = unreadMessagesCount[0].count),
      );

    if (!chatrooms[i].isEventChatroom) {
      await knex
        .select('users.id', 'avatar', 'username', 'image')
        .from('user_chatroom')
        .leftJoin('users', 'user_chatroom.participantId', 'users.id')
        .where('user_chatroom.chatroomId', chatrooms[i].chatroomId)
        .then(
          participantsData =>
            (chatrooms[i].participantsData = participantsData),
        );
    } else {
      await knex
        .select('events.title', 'events.eventImage', 'events.id')
        .from('events')
        .where('events.chatroomId', chatrooms[i].chatroomId)
        .then(eventData => (chatrooms[i].eventData = eventData[0]));
    }
  }

  /*for (let i = chatrooms.length - 1; i > 0; i--) {
    if (!chatrooms[i].lastMessage) {
      chatrooms.splice(i, 1);
    }
  }*/

  return chatrooms;
};

export const dbCreateChatroom = async chatroomInfo => {
  console.log(chatroomInfo.creatorId);
  const chatroom = await knex
    .insert({ creatorId: chatroomInfo.creatorId })
    .into('chatrooms')
    .returning('*')
    .then(createdChatrooms => createdChatrooms[0]);

  await knex('user_chatroom')
    .insert([
      { chatroomId: chatroom.id, participantId: chatroomInfo.participantId },
      { chatroomId: chatroom.id, participantId: chatroomInfo.creatorId },
    ])
    .returning('*')
    .then();

  return chatroom;
};
