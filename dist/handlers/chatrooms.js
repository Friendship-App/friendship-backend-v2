'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.createChatroom = exports.getChatrooms = exports.getUserChatroom = undefined;

var _chatrooms = require('../models/chatrooms');

const getUserChatroom = (exports.getUserChatroom = (request, reply) =>
  (0, _chatrooms.dbGetUserChatroom)(request.query.userId).then(data =>
    reply.response(data),
  ));

const getChatrooms = (exports.getChatrooms = (request, reply) =>
  (0, _chatrooms.dbGetChatrooms)(request.pre.user.id).then(data => {
    return reply.response(data);
  }));

const createChatroom = (exports.createChatroom = (request, reply) => {
  return (0, _chatrooms.dbCreateChatroom)(request.payload).then(
    createdChatroom => reply.response(createdChatroom),
  );
});
//# sourceMappingURL=chatrooms.js.map
