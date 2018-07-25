import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import {
  createChatroom,
  getChatrooms,
  getUserChatroom,
} from '../handlers/chatrooms';

const chatrooms = [
  {
    method: 'GET',
    path: '/api/userChatroom',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription(
        'Get chatroom id for a specific user by userId',
        'chatrooms',
      ),
    ),
    handler: getUserChatroom,
  },
  {
    method: 'GET',
    path: '/api/chatrooms',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription(
        'Get all the chatrooms for a specific user',
        'chatrooms',
      ),
    ),
    handler: getChatrooms,
  },
  {
    method: 'POST',
    path: '/api/chatrooms/create',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Create a new chatroom', 'chatrooms'),
    ),
    handler: createChatroom,
  },
];

export default chatrooms;
