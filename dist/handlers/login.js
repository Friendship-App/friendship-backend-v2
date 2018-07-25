'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.authenticateUser = undefined;

var _auth = require('../utils/auth');

const authenticateUser = (exports.authenticateUser = (request, reply) =>
  reply.response(
    (0, _auth.createToken)({
      id: request.pre.user.id,
      email: request.pre.user.email,
      scope: request.pre.user.scope,
    }),
  ));
//# sourceMappingURL=login.js.map
