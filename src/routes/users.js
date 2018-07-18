import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import {
  getBatchUsers,
  getUserInformation,
  registerNotificationToken,
} from '../handlers/users';
import { getAuthWithScope } from '../utils/auth';

const users = [
  {
    method: 'GET',
    path: '/api/users/{batchSize}',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Get a batch of the users', 'users'),
    ),
    handler: getBatchUsers,
  },
  {
    method: 'GET',
    path: '/api/users',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Get a specific user information by id', 'users'),
    ),
    handler: getUserInformation,
  },
  {
    method: 'PATCH',
    path: '/users/push-token',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Register push notifications token', 'users'),
    ),
    handler: registerNotificationToken,
  },
];

export default users;
