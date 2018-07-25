'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.registerUser = exports.checkInputAvailability = undefined;

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _register = require('../models/register');

var _auth = require('../utils/config/auth');

var _auth2 = _interopRequireDefault(_auth);

var _password = require('./password');

var _locations = require('./locations');

var _genders = require('./genders');

var _tags = require('./tags');

var _personalities = require('./personalities');

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

const checkInputAvailability = (exports.checkInputAvailability = (
  request,
  reply,
) => {
  const { username, email } = request.query;
  if (username) {
    return (0, _register.dbCheckUsernameAvailability)(username).then(data =>
      reply.response(data[0].count),
    );
  }
  return (0, _register.dbCheckEmailAvailability)(email).then(data =>
    reply.response(data[0].count),
  );
});

const registerUser = (exports.registerUser = (() => {
  var _ref = _asyncToGenerator(function*(request, reply) {
    const {
      password,
      scope,
      email,
      description,
      username,
      image,
      birthyear,
      avatar,
      genders,
      locations,
      personalities,
      lovedTags,
      hatedTags,
    } = request.payload;
    const hashedPassword = yield hashPassword(password);
    const fieldsToCreateUser = {
      email,
      description,
      username,
      birthyear,
      avatar,
      image,
      scope,
    };
    return yield (0, _register.dbCreateUser)(fieldsToCreateUser)
      .then(
        (() => {
          var _ref2 = _asyncToGenerator(function*(userId) {
            yield (0, _password.registerPassword)(userId, hashedPassword);
            yield (0, _locations.registerLocations)(userId, locations);
            yield (0, _genders.registerGenders)(userId, genders);
            yield (0,
            _personalities.registerPersonalities)(userId, personalities);
            yield (0, _tags.registerTags)(userId, lovedTags, hatedTags);
          });

          return function(_x3) {
            return _ref2.apply(this, arguments);
          };
        })(),
      )
      .then(function() {
        return reply.response();
      });
  });

  return function registerUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

// Return promise which resolves to hash of given password
const hashPassword = password =>
  new Promise((resolve, reject) => {
    _bcryptjs2.default.genSalt(_auth2.default.saltRounds, (saltErr, salt) => {
      if (saltErr) {
        reject(saltErr);
      }
      _bcryptjs2.default.hash(password, salt, (hashErr, hash) => {
        if (hashErr) {
          reject(hashErr);
        } else {
          resolve(hash);
        }
      });
    });
  });
//# sourceMappingURL=register.js.map
