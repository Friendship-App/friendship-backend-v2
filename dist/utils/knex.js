'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _db = require('./config/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = (0, _knex2.default)(_db2.default);
//# sourceMappingURL=knex.js.map
