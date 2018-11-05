import { merge } from 'lodash';
import { getAuthWithScope } from '../../utils/auth';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import {
  banUser,
  deleteUser,
  getUser,
  getUsers,
  toggleAccountActivation,
} from '../../handlers/admin/users';

const users = [
  {
    method: 'GET',
    path: '/api/admin/users',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Get all the users for the admin', 'users'),
    ),
    handler: getUsers,
  },
  {
    method: 'PATCH',
    path: '/api/admin/users/{userId}',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Update user enabled', 'users'),
    ),
    handler: toggleAccountActivation,
  },
  {
    method: 'GET',
    path: '/api/admin/users/{userId}',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Get a specific user details', 'users'),
    ),
    handler: getUser,
  },
  {
    method: 'POST',
    path: '/api/admin/users/delete/{userId}',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Delete a specific user', 'users'),
    ),
    handler: deleteUser,
  },
  {
    method: 'POST',
    path: '/users/{userId}/ban',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Ban a user', 'users'),
    ),
    handler: banUser,
  },
];

export default users;
