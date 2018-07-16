import { dbGetUserChatroom } from '../models/chatrooms';

export const getUserChatroom = (request, reply) =>
  dbGetUserChatroom(request.query.userId).then(data => reply.response(data));
