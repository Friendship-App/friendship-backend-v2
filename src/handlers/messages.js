import {
  dbCreateMessage,
  dbGetMessages,
  dbRegisterNewUnreadMessage,
  dbUpdateMessages,
} from '../models/messages';

export const updateMessages = (request, reply) =>
  dbUpdateMessages(request.query.chatroomId, request.pre.user.id).then(
    reply.response(),
  );

export const getMessages = (request, reply) =>
  dbGetMessages(request.query.chatroomId).then(data => reply.response(data));

export const createMessage = async function(request, reply) {
  return dbCreateMessage({
    chatTime: new Date(),
    senderId: request.pre.user.id,
    textMessage: request.payload.textMessage,
    chatroomId: request.payload.chatroomId,
  })
    .then(async message => {
      const newUnreadMessages = [];
      request.payload.receiverId.map(id => {
        newUnreadMessages.push({
          messageId: message.id,
          receiverId: id,
          chatroomId: message.chatroomId,
        });
      });
      await dbRegisterNewUnreadMessage(newUnreadMessages);
      return message;
    })
    .then(chatroomId => reply.response(chatroomId));
};
