import {
  dbCreateChatroom,
  dbGetChatrooms,
  dbGetUserChatroom,
} from '../models/chatrooms';

export const getUserChatroom = (request, reply) =>
  dbGetUserChatroom(request.pre.user.id, request.query.userId).then(data =>
    reply.response(data),
  );

export const getChatrooms = (request, reply) =>
  dbGetChatrooms(request.pre.user.id).then(data => {
    return reply.response(data);
  });

export const createChatroom = (request, reply) => {
  return dbCreateChatroom(request.payload).then(createdChatroom =>
    reply.response(createdChatroom),
  );
};
