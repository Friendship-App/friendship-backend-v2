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
  server: {
    host: env.HOST || '0.0.0.0',
    port: env.PORT || 3888,
  },
  db: {
    // Common config for all db environments
    debug: true, // Toggle db debugging
    client: 'pg',
    connection: env.DATABASE_URL || {
      host: '127.0.0.1',
      user: 'postgres',
      password: '',
      database: 'friendship',
      ssl: false,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
  },
  auth: {
    secret: env.SECRET || 'really_secret_key',
    saltRounds: 10,
    options: {
      algorithms: ['HS256'],
      expiresIn: '24h',
    },
  },
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
//# sourceMappingURL=oldconfig.js.map
