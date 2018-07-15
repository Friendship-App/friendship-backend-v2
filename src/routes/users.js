import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/EndpointDescriptionGenerator';
import { checkInputAvailability, getUsers } from '../handlers/users';

const users = [
  {
    method: 'GET',
    path: '/api/users',
    config: {
      description: 'Get all the users',
      tags: ['api', 'v1', 'users'],
    },
    handler: getUsers,
  },
];

export default users;
