const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
// yarn db:init yes
const chatroomFields = {
  creatorId: () => faker.random.number({ min: 1, max: 51 }),
};

exports.seed = knex =>
  knex
    .batchInsert(
      'chatrooms',
      simpleFixtures.generateFixtures(chatroomFields, 25),
    )
    .then(async () => {
      const participants = [];
      const chatrooms = await knex
        .select()
        .from('chatrooms')
        .then(chatrooms => chatrooms);

      chatrooms.map(async chatroom => {
        participants.push({
          chatroomId: chatroom.id,
          participantId: chatroom.creatorId,
        });
        participants.push({
          chatroomId: chatroom.id,
          participantId: faker.random.number({ min: 1, max: 51 }),
        });
      });

      knex.batchInsert('user_chatroom', participants);
    });
