'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbGetAvatars = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const dbGetAvatars = (exports.dbGetAvatars = () =>
  _knex2.default.select().from('avatars'));
//# sourceMappingURL=avatars.js.map
