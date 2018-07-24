const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');

const tosFields = {
  tos_text: faker.lorem.sentences,
  createdAt: moment(),
};

exports.seed = knex =>
  knex.batchInsert(
    'terms_of_service',
    simpleFixtures.generateFixtures(tosFields, 1),
  );
