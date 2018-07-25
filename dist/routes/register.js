'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _register = require('../handlers/register');

const register = [
  {
    method: 'POST',
    path: `/api/register`,
    config: (0, _lodash.merge)(
      {},
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Register a new user',
        'registration',
      ),
    ),
    handler: _register.registerUser,
  },
  {
    method: 'GET',
    path: `/api/register/validate`,
    config: (0, _lodash.merge)(
      {},
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Validate that a username or an email is available',
        'registration',
      ),
    ),
    handler: _register.checkInputAvailability,
  },
];

exports.default = register;
//# sourceMappingURL=register.js.map
