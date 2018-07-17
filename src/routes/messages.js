import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getMessages, updateMessages } from '../handlers/messages';

const messages = [
  {
    method: 'PUT',
    path: '/api/messages/update',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Update messages for a specific user', 'messages'),
    ),
    handler: updateMessages,
  },
  {
    method: 'GET',
    path: '/api/messages',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription(
        'Get messages for a specific user/chatroom',
        'messages',
      ),
    ),
    handler: getMessages,
  },
];

export default messages;
