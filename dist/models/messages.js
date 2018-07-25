'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbRegisterNewUnreadMessage = exports.dbCreateMessage = exports.dbGetMessages = exports.dbUpdateMessages = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const dbUpdateMessages = (exports.dbUpdateMessages = (chatroomId, receiverId) =>
  _knex2.default
    .del()
    .from('unread_messages')
    .where({ chatroomId, receiverId })
    .then());

const dbGetMessages = (exports.dbGetMessages = chatroomId =>
  _knex2.default
    .select()
    .from('messages')
    .where({ chatroomId })
    .orderBy('chatTime', 'desc'));

const dbCreateMessage = (exports.dbCreateMessage = fields => {
  return (0, _knex2.default)('messages')
    .insert(fields)
    .returning('*')
    .then(data => data[0]);
});

const dbRegisterNewUnreadMessage = (exports.dbRegisterNewUnreadMessage = fields =>
  (0, _knex2.default)('unread_messages')
    .insert(fields)
    .then());
//# sourceMappingURL=messages.js.map
