'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.registerTags = exports.getUserTags = exports.getTags = undefined;

var _tags = require('../models/tags');

const getTags = (exports.getTags = (request, reply) =>
  (0, _tags.dbGetTags)().then(data => reply.response(data)));

const getUserTags = (exports.getUserTags = (request, reply) =>
  (0, _tags.dbGetUserTags)(request.query.userId, request.pre.user.id).then(
    data => reply.response(data),
  ));

const registerTags = (exports.registerTags = (userId, lovedTags, hatedTags) => {
  let userTags = [];
  userTags = formatTags(userId, lovedTags, userTags, true);
  userTags = formatTags(userId, hatedTags, userTags, false);
  console.log(userTags);
  return (0, _tags.dbRegisterTags)(userTags);
});

function formatTags(userId, tags, userTags, love) {
  const tmpUserTags = userTags;
  tags.map(tag => tmpUserTags.push({ userId, tagId: tag, love }));
  return tmpUserTags;
}
//# sourceMappingURL=tags.js.map
