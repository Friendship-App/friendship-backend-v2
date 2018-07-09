import { getUsers } from '../handlers/users';

const users = [
  {
    method: 'GET',
    path: '/api/users',
    handler: getUsers,
  },
  {
    method: 'GET',
    path: '/api/users/{id}',
    handler: function() {
      console.log('hello world 2');
      return 'Hello World 2';
    },
    // prefix: '/api'
  },
];

export default users;
