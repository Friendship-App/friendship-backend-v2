import { merge } from 'lodash';
import { getAuthWithScope } from '../../utils/auth';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import { getUsers } from '../../handlers/admin/users';

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
];

export default users;
