import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getUserChatroom } from '../handlers/chatrooms';

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
];

export default chatrooms;
