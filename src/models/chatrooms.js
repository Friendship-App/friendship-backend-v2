import knex from '../utils/knex';

export const dbGetUserChatroom = (userId, participantId) => {
  return knex.transaction(async trx => {
    const chatroom = await trx
      .raw(
        `
            select "chatroomId"
            from user_chatroom
            where "participantId" = ?
            intersect
            select "chatroomId"
            from user_chatroom
            where "participantId" = ?
        `,
        [userId, participantId],
      )
      .then(data => data.rows);

    if (chatroom.length > 0) {
      let i = 0;
      while (i < chatroom.length) {
        const isEventChatroom = await trx
          .select('*')
          .from('events')
          .where({ chatroomId: chatroom[i].chatroomId });

        if (isEventChatroom.length === 0) {
          return [chatroom[i]];
        }
        console.log(i);
        i++;
      }
    }
    return [];
  });
};

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
        .select('users.id', 'mood', 'username', 'image', 'active')
        .from('user_chatroom')
        .leftJoin('users', 'user_chatroom.participantId', 'users.id')
        .where('user_chatroom.chatroomId', chatrooms[i].chatroomId)
        .then(
          participantsData =>
            (chatrooms[i].participantsData = participantsData),
        );
    } else {
      await knex
        .select(
          'events.title',
          'events.eventImage',
          'events.id',
          'events.active',
        )
        .from('events')
        .where('events.chatroomId', chatrooms[i].chatroomId)
        .then(eventData => {
          if (eventData.length > 0) chatrooms[i].eventData = eventData[0];
          else chatrooms[i].missingEvent = true;
        });
    }
  }

  chatrooms = chatrooms.filter(chatroom => !chatroom.missingEvent);

  /*for (let i = chatrooms.length - 1; i > 0; i--) {
    if (!chatrooms[i].lastMessage) {
      chatrooms.splice(i, 1);
    }
  }*/

  return chatrooms;
};

export const dbCreateChatroom = async chatroomInfo => {
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
