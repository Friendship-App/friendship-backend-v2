'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getAvatars = undefined;

var _avatars = require('../models/avatars');

const getAvatars = (exports.getAvatars = (request, reply) =>
  (0, _avatars.dbGetAvatars)().then(data => reply.response(data)));
//# sourceMappingURL=avatars.js.map
