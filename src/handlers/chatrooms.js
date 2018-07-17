import { dbGetChatrooms, dbGetUserChatroom } from '../models/chatrooms';

export const getUserChatroom = (request, reply) =>
  dbGetUserChatroom(request.query.userId).then(data => reply.response(data));

export const getChatrooms = (request, reply) =>
  dbGetChatrooms(request.pre.user.id).then(data => {
    return reply.response(data);
  });
