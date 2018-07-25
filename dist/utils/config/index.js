'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const env = process.env;

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  _dotenv2.default.config({ silent: true });
}

const requiredEnvironmentVariables = ['DATABASE_URL', 'SECRET'];

if (env.NODE_ENV && env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test') {
  requiredEnvironmentVariables.forEach(key => {
    if (!env[key]) {
      /* eslint-disable no-console */
      console.log(`Warning: Environment variable ${key} not set.`);
      /* eslint-enable no-console */

      throw new Error('Quitting.');
    }
  });
}

const config = {
  db: _extends({}, _db2.default),
};

exports.default = _extends({}, config, {
  db: {
    // Developer's local machine
    development: _extends({}, config.db, {
      seeds: {
        directory: 'seeds-dev',
      },
    }),

    // Production environment
    production: _extends({}, config.db, {
      seeds: {
        directory: 'seeds-prod',
      },
    }),
  },
});
//# sourceMappingURL=index.js.map
