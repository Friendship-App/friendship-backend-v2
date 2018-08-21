import { merge } from 'lodash';
import { getAuthWithScope } from '../../utils/auth';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import { getUsers, toggleAccountActivation } from '../../handlers/admin/users';

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
];

export default users;
