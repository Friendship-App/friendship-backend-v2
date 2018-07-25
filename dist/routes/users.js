'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _users = require('../handlers/users');

var _auth = require('../utils/auth');

const users = [
  {
    method: 'GET',
    path: '/api/users/{batchSize}',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get a batch of the users',
        'users',
      ),
    ),
    handler: _users.getBatchUsers,
  },
  {
    method: 'GET',
    path: '/api/users',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get a specific user information by id',
        'users',
      ),
    ),
    handler: _users.getUserInformation,
  },
  {
    method: 'PATCH',
    path: '/users/push-token',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Register push notifications token',
        'users',
      ),
    ),
    handler: _users.registerNotificationToken,
  },
];

exports.default = users;
//# sourceMappingURL=users.js.map
