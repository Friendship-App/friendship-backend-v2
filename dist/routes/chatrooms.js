'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _auth = require('../utils/auth');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _chatrooms = require('../handlers/chatrooms');

const chatrooms = [
  {
    method: 'GET',
    path: '/api/userChatroom',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get chatroom id for a specific user by userId',
        'chatrooms',
      ),
    ),
    handler: _chatrooms.getUserChatroom,
  },
  {
    method: 'GET',
    path: '/api/chatrooms',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Get all the chatrooms for a specific user',
        'chatrooms',
      ),
    ),
    handler: _chatrooms.getChatrooms,
  },
  {
    method: 'POST',
    path: '/api/chatrooms/create',
    config: (0, _lodash.merge)(
      {},
      (0, _auth.getAuthWithScope)('user'),
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Create a new chatroom',
        'chatrooms',
      ),
    ),
    handler: _chatrooms.createChatroom,
  },
];

exports.default = chatrooms;
//# sourceMappingURL=chatrooms.js.map
