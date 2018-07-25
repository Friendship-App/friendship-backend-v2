'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbGetUserPersonalities = exports.dbRegisterPersonalities = exports.dbGetPersonalities = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const dbGetPersonalities = (exports.dbGetPersonalities = () =>
  _knex2.default.select().from('personalities'));

const dbRegisterPersonalities = (exports.dbRegisterPersonalities = userPersonalities =>
  _knex2.default.insert(userPersonalities).into('user_personality'));

const dbGetUserPersonalities = (exports.dbGetUserPersonalities = userId =>
  _knex2.default
    .select('id', 'name')
    .from('user_personality')
    .leftJoin('personalities', 'id', 'personalityId')
    .where({ userId }));
//# sourceMappingURL=personalities.js.map
