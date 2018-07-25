'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _auth = require('../utils/auth');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _messages = require('../handlers/messages');

const messages = [
  {
    method: 'PUT',
    path: '/api/messages/update',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Update messages for a specific user',
        'messages',
      ),
    ),
    handler: _messages.updateMessages,
  },
  {
    method: 'GET',
    path: '/api/messages',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get messages for a specific user/chatroom',
        'messages',
      ),
    ),
    handler: _messages.getMessages,
  },
  {
    method: 'POST',
    path: '/api/messages/send',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Add a new message',
        'messages',
      ),
    ),
    handler: _messages.createMessage,
  },
];

exports.default = messages;
//# sourceMappingURL=messages.js.map
