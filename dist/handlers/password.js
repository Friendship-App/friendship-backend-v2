'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.registerPassword = undefined;

var _password = require('../models/password');

const registerPassword = (exports.registerPassword = (userId, hashPassword) =>
  (0, _password.dbRegisterPassword)({
    ownerId: userId,
    password: hashPassword,
  }));
//# sourceMappingURL=password.js.map
