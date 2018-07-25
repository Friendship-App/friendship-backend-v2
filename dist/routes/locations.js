'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _lodash = require('lodash');

var _locations = require('../handlers/locations');

const locations = [
  {
    method: 'GET',
    path: '/api/locations',
    config: (0, _lodash.merge)(
      {},
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get all the locations',
        'locations',
      ),
    ),
    handler: _locations.getLocations,
  },
];

exports.default = locations;
//# sourceMappingURL=locations.js.map
