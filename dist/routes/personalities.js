'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _personalities = require('../handlers/personalities');

var _auth = require('../utils/auth');

const personalities = [
  {
    method: 'GET',
    path: '/api/personalities',
    config: (0, _lodash.merge)(
      {},
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get all the personalities',
        'personalities',
      ),
    ),
    handler: _personalities.getPersonalities,
  },
  {
    method: 'GET',
    path: '/api/userPersonalities',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get the personalities for a specific user by id',
        'personalities',
      ),
    ),
    handler: _personalities.getUserPersonalities,
  },
];

exports.default = personalities;
//# sourceMappingURL=personalities.js.map
