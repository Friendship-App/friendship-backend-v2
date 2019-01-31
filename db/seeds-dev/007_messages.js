import moment from 'moment';

const faker = require('faker/locale/en');
const momentRandom = require('moment-random');

exports.seed = knex =>
  knex('messages')
    .del()
    .then(() => knex('chatrooms').select())
    .then(chatrooms => {
      const messages = [];

      chatrooms.forEach(chatroom =>
        [...Array(faker.random.number(25))].forEach(() =>
          messages.push({
            textMessage: faker.lorem.sentences(),
            chatroomId: chatroom.id,
            senderId: chatroom.creatorId,
            chatTime: momentRandom(moment(), '2018-01-01'),
          }),
        ),
      );

      return knex.batchInsert('messages', messages);
    });
