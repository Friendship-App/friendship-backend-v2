import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import {
  createMessage,
  getMessages,
  updateMessages,
} from '../handlers/messages';

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
  {
    method: 'POST',
    path: '/api/messages/send',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Add a new message', 'messages'),
    ),
    handler: createMessage,
  },
];

export default messages;
