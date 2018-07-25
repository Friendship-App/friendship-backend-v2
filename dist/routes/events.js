'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _auth = require('../utils/auth');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _events = require('../handlers/events');

const events = [
  {
    method: 'GET',
    path: '/api/events',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get all the events for a user',
        'events',
      ),
    ),
    handler: _events.getEvents,
  },
  {
    method: 'POST',
    path: '/api/events',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Create an event',
        'events',
      ),
    ),
    handler: _events.createEvent,
  },
  {
    method: 'GET',
    path: '/api/events/{eventId}',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get details on a specific event',
        'events',
      ),
    ),
    handler: _events.getEventDetails,
  },
];

exports.default = events;
//# sourceMappingURL=events.js.map
