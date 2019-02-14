import {
  dbCreateMessage,
  dbGetMessages,
  dbRegisterNewUnreadMessage,
  dbUpdateMessages,
  dbGetDataForMessageNotification,
} from '../models/messages';
import { notifyReveiceNewMessage } from '../utils/notifications';

export const updateMessages = (request, reply) =>
  dbUpdateMessages(request.query.chatroomId, request.pre.user.id).then(
    reply.response(),
  );

export const getMessages = (request, reply) =>
  dbGetMessages(request.query.chatroomId).then(data => reply.response(data));

const sendNewMessagePushNotification = async (senderId, chatroomId) => {
  const dataForMessageNotifications = await dbGetDataForMessageNotification(
    senderId,
    chatroomId,
  );
  notifyReveiceNewMessage(dataForMessageNotifications);
};

export const createMessage = async function(request, reply) {
  const senderId = request.pre.user.id;
  const chatroomId = request.payload.chatroomId;
  return dbCreateMessage({
    chatTime: new Date(),
    senderId,
    textMessage: request.payload.textMessage,
    chatroomId,
  })
    .then(async message => {
      sendNewMessagePushNotification(senderId, chatroomId);
      const newUnreadMessages = [];
      request.payload.receiverId.map(id => {
        newUnreadMessages.push({
          messageId: message.id,
          receiverId: id,
          chatroomId,
        });
      });
      await dbRegisterNewUnreadMessage(newUnreadMessages);
      return message;
    })
    .then(chatroomId => reply.response(chatroomId));
};
