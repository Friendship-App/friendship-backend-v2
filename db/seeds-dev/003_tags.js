const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');
const moment = require('moment');

const tagsLabel = [
  'Eating well',
  'Doing fitness stuff',
  'Netflix & chill',
  'Coffee & discussing',
  'Backpacking',
  'Playing video games',
  'Rap-music',
  'Incorrect jokes/Memes',
  'Art galleries',
  'Cats & Dogs',
  'Spirituality',
  'Vegetarian food',
];

const tags = [];

tagsLabel.map(activity => {
  tags.push({
    creatorId: 2,
    name: activity,
    createdAt: moment(),
  });
});

let userId = 1;
let tagId = 0;

const usertagFields = {
  userId: () => {
    if (tagId === 10) {
      userId += 1;
      tagId = 0;
    }
    return userId;
  },
  tagId: () => {
    tagId += 1;
    return tagId;
  },
  love: () => faker.random.number({ min: 0, max: 1 }),
};

exports.seed = knex =>
  knex
    .batchInsert('tags', tags)
    .then(() =>
      knex.batchInsert(
        'user_tag',
        simpleFixtures.generateFixtures(usertagFields, 100),
      ),
    );
