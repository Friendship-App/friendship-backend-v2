'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbRegisterPassword = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const dbRegisterPassword = (exports.dbRegisterPassword = secrets =>
  _knex2.default.insert(secrets).into('secrets'));
//# sourceMappingURL=password.js.map
