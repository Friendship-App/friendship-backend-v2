import { dbGetMessages, dbUpdateMessages } from '../models/messages';

export const updateMessages = (request, reply) =>
  dbUpdateMessages(request.query.chatroomId, request.pre.user.id).then(
    reply.response(),
  );

export const getMessages = (request, reply) =>
  dbGetMessages(request.query.chatroomId).then(data => reply.response(data));
