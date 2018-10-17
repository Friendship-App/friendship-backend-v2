const simpleFixtures = require('simple-fixtures');

// Designer decided to have a preset list
// Using this for the seed data as well
const personalities = [
  'planner',
  'spontaneous',
  'dreamer',
  'realistic',
  'play it safe',
  'risk Taker',
  'chilling out',
  'going out',
  'relaxed',
  'ambitious',
  'introvert',
  'extrovert',
];
let index = 0;

const personalityFields = {
  name: () => personalities[index++],
};

exports.seed = knex =>
  knex.batchInsert(
    'personalities',
    simpleFixtures.generateFixtures(personalityFields, personalities.length),
  );
