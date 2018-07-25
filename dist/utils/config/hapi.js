'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.hapiOptions = exports.hapiManifest = undefined;

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const hapiManifest = (exports.hapiManifest = {
  server: {
    port: 3000,
    host: '0.0.0.0',
    debug: process.env.NODE_ENV === 'test' ? false : { request: ['error'] },
  },
  register: {
    plugins: [
      { plugin: 'hapi-auth-jwt2' },
      { plugin: 'good', options: _log2.default },
      { plugin: 'vision' },
      { plugin: 'inert' },
      {
        plugin: 'hapi-swagger',
        options: {
          pathPrefixSize: 2,
          basePath: '/api',
          info: {
            title: 'Friendship API Documentation',
            version: 'v1.0',
          },
        },
      },
    ],
  },
});

const hapiOptions = (exports.hapiOptions = {
  relativeTo: __dirname,
});
//# sourceMappingURL=hapi.js.map
