'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.registerNotificationToken = exports.getUserInformation = exports.getBatchUsers = undefined;

var _users = require('../models/users');

const getBatchUsers = (exports.getBatchUsers = (request, reply) => {
  return (0, _users.dbGetUsersBatch)(
    request.params.batchSize,
    request.pre.user.id,
  ).then(data => reply.response(data));
});

const getUserInformation = (exports.getUserInformation = (request, reply) => {
  return (0, _users.dbGetUserInformation)(request.query.userId).then(data =>
    reply.response(data),
  );
});

const registerNotificationToken = (exports.registerNotificationToken = (
  request,
  reply,
) => {
  return (0, _users.dbRegisterNotificationToken)(
    request.payload.userId,
    request.payload.token,
  ).then(reply);
});
//# sourceMappingURL=users.js.map
