import { merge } from 'lodash';
import { getAuthWithScope } from '../../utils/auth';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import {
  deleteUser,
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
      getEndpointDescription('Get all the users for the admin', 'users'),
    ),
    handler: toggleAccountActivation,
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
];

export default users;
