module.exports = [
  {
    method: 'GET',
    path: '/users',
    handler: function () {
      console.log('hello world');
      return 'Hello World';
    }
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: function () {
      console.log('hello world 2');
      console.log('hello world 2');
      return 'Hello World 2';
    }
  }
];