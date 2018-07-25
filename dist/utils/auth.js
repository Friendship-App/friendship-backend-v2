'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.bindUserData = exports.getAuthWithScope = exports.createToken = exports.doAuth = exports.preVerifyCredentials = exports.comparePasswords = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _users = require('../models/users');

var _auth = require('./config/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            },
          );
        }
      }
      return step('next');
    });
  };
}

const comparePasswords = (exports.comparePasswords = (passwordAttempt, user) =>
  new Promise((resolve, reject) =>
    _bcryptjs2.default.compare(
      passwordAttempt,
      user.password,
      (err, isValid) => {
        if (!err && isValid) {
          resolve(user);
        } else {
          reject(
            `Incorrect password attempt by user with email '${user.email}'`,
          );
        }
      },
    ),
  ));

const preVerifyCredentials = (exports.preVerifyCredentials = (
  { payload: { email, password: passwordAttempt } },
  reply,
) =>
  (0, _knex2.default)('users')
    .first()
    .where({ email: email.toLowerCase().trim() })
    .leftJoin('secrets', 'users.id', 'secrets.ownerId')
    .then(
      (() => {
        var _ref = _asyncToGenerator(function*(user) {
          if (!user) {
            return Promise.reject(
              `User with email '${email}' not found in database`,
            );
          }

          if (yield (0, _users.dbUserIsBanned)(user)) {
            return Promise.reject(`'${email}' has been banned`);
          }

          if (!user.password) {
            return Promise.reject(
              `User with email '${email}' lacks password: logins disabled`,
            );
          }

          return comparePasswords(passwordAttempt, user);
        });

        return function(_x) {
          return _ref.apply(this, arguments);
        };
      })(),
    )
    .then(response => reply.response(response))
    .catch(err => {
      console.log(err);
      if (err.valueOf().includes('activated')) {
        return _boom2.default.unauthorized(err);
      }
      return _boom2.default.unauthorized(err);
    }));

const doAuth = (exports.doAuth = {
  validate: {
    payload: {
      email: _joi2.default.string().required(),
      password: _joi2.default.string().required(),
    },
    failAction: (request, reply) =>
      _boom2.default.unauthorized('Incorrect email or password!'),
  },
  pre: [{ method: preVerifyCredentials, assign: 'user' }],
});

const createToken = (exports.createToken = fields => ({
  token: _jsonwebtoken2.default.sign(fields, _auth2.default.secret, {
    algorithm: _auth2.default.options.algorithms[0],
  }),
}));

const bearerRegex = /(Bearer\s+)*(.*)/i;

const getAuthWithScope = (exports.getAuthWithScope = scope => ({
  auth: { strategy: 'jwt', scope: ['admin', scope] },
  pre: [{ method: bindUserData, assign: 'user' }],
}));

const bindUserData = (exports.bindUserData = (request, reply) => {
  const authHeader = request.headers.authorization;

  const token = authHeader.match(bearerRegex)[2];
  const decoded = _jsonwebtoken2.default.decode(token);

  return reply.response(decoded);
});
//# sourceMappingURL=auth.js.map
