import { getUsers } from '../handlers/users';

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
  {
    method: 'GET',
    path: '/api/users/{id}',
    handler: function() {
      console.log('hello world 2');
      return 'Hello World 2';
    },
  },
  {
    method: 'GET',
    path: '/api/users/page/{pageNumber}',
    // config: merge({}, validate.pageNumberFields, getAuthWithScope('user'))
    handler: () => {},
  },
  // Get info about a specific user by userId
  {
    method: 'GET',
    path: '/users/{userId}',
    // config: merge({}, validateUserId, getAuthWithScope('user')),
    handler: () => {},
  },
];

export default users;
