import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getBatchUsers, getUserInformation } from '../handlers/users';
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
];

export default users;
