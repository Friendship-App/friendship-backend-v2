'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getUserPersonalities = exports.registerPersonalities = exports.getPersonalities = undefined;

var _personalities = require('../models/personalities');

const getPersonalities = (exports.getPersonalities = (request, reply) =>
  (0, _personalities.dbGetPersonalities)().then(data => reply.response(data)));

const registerPersonalities = (exports.registerPersonalities = (
  userId,
  personalities,
) => {
  const userPersonalities = [];
  personalities.map(personality =>
    userPersonalities.push({ userId, personalityId: personality, level: 5 }),
  );
  return (0, _personalities.dbRegisterPersonalities)(userPersonalities);
});

const getUserPersonalities = (exports.getUserPersonalities = (request, reply) =>
  (0, _personalities.dbGetUserPersonalities)(request.query.userId).then(data =>
    reply.response(data),
  ));
//# sourceMappingURL=personalities.js.map
