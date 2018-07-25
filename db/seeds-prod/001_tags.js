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
    creatorId: 1,
    name: activity,
    createdAt: moment(),
  });
});

exports.seed = knex => knex.batchInsert('tags', tags).then();
