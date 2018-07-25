'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbCreateUser = exports.dbCheckEmailAvailability = exports.dbCheckUsernameAvailability = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const dbCheckUsernameAvailability = (exports.dbCheckUsernameAvailability = username =>
  _knex2.default
    .count()
    .from('users')
    .whereRaw(_knex2.default.raw('LOWER("username") = ?', username)));

const dbCheckEmailAvailability = (exports.dbCheckEmailAvailability = email =>
  _knex2.default
    .count()
    .from('users')
    .whereRaw(_knex2.default.raw('LOWER("email") = ?', email)));

const dbCreateUser = (exports.dbCreateUser = userInformation =>
  _knex2.default.transaction(trx => {
    return trx
      .insert(userInformation)
      .into('users')
      .then(() => {
        return trx
          .select('id')
          .from('users')
          .orderBy('id', 'desc')
          .then(data => {
            return data[0].id;
          });
      });
  }));
//# sourceMappingURL=register.js.map
