'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _login = require('../handlers/login');

var _auth = require('../utils/auth');

const login = [
  {
    method: 'POST',
    path: '/api/login',
    config: (0, _lodash.merge)(
      {},
      _auth.doAuth,
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Authenticate a user',
        'login',
      ),
    ),
    handler: _login.authenticateUser,
  },
];

exports.default = login;
//# sourceMappingURL=login.js.map
