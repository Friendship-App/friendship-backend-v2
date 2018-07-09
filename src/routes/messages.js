const users = [
  {
    method: 'GET',
    path: '/api/messages',
    handler: function() {
      console.log('messages ...');
      return 'here are the messages';
    },
  },
  {
    method: 'GET',
    path: '/api/messages/{id}',
    handler: function() {
      console.log('msg ...');
      return 'messages ...';
    },
  },
];

export default users;
