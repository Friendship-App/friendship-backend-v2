import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import {
  deleteUser,
  getBatchUsers,
  getUserInformation,
  registerNotificationToken,
  reportUser,
  updateAccount,
  updateProfile,
} from '../handlers/users';
import { getAuthWithScope } from '../utils/auth';

const users = [
  {
    method: 'POST',
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
    method: 'POST',
    path: '/api/users/push-token',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Register push notifications token', 'users'),
    ),
    handler: registerNotificationToken,
  },
  {
    method: 'POST',
    path: '/api/users/updateProfile',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Update a user profile', 'users'),
    ),
    handler: updateProfile,
  },
  {
    method: 'POST',
    path: '/api/users/updateAccount',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Update a user account', 'users'),
    ),
    handler: updateAccount,
  },
  {
    method: 'POST',
    path: '/api/users/report',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Report a user', 'users'),
    ),
    handler: reportUser,
  },
  {
    method: 'POST',
    path: '/api/users/delete',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Delete a specific user', 'users'),
    ),
    handler: deleteUser,
  },
];

export default users;
