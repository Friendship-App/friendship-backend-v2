'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _avatars = require('../handlers/avatars');

const avatars = [
  {
    method: 'GET',
    path: '/api/avatars',
    config: (0, _lodash.merge)(
      {},
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get all the avatars',
        'avatars',
      ),
    ),
    handler: _avatars.getAvatars,
  },
];

exports.default = avatars;
//# sourceMappingURL=avatars.js.map
