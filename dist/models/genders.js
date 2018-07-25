'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbRegisterGenders = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const dbRegisterGenders = (exports.dbRegisterGenders = userGenders =>
  _knex2.default.insert(userGenders).into('user_gender'));
//# sourceMappingURL=genders.js.map
