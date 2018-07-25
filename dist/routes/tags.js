'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _tags = require('../handlers/tags');

var _auth = require('../utils/auth');

const tags = [
  {
    method: 'GET',
    path: '/api/tags',
    config: (0, _lodash.merge)(
      {},
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get all the interests',
        'tags',
      ),
    ),
    handler: _tags.getTags,
  },
  {
    method: 'GET',
    path: '/api/tagsForUser',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get the tags for a specific user by id',
        'tags',
      ),
    ),
    handler: _tags.getUserTags,
  },
];

exports.default = tags;
//# sourceMappingURL=tags.js.map
