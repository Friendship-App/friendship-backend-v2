'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbRegisterLocations = exports.dbGetLocations = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const dbGetLocations = (exports.dbGetLocations = () =>
  _knex2.default
    .select()
    .from('locations')
    .orderBy('name'));

const dbRegisterLocations = (exports.dbRegisterLocations = userLocations =>
  _knex2.default.insert(userLocations).into('user_location'));
//# sourceMappingURL=locations.js.map
