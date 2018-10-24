const moment = require('moment');

const tagsLabel = [
  'Wolt over new recipes',
  'Lover of nature activities',
  'Music geek',
  'Books over Netflix',
  'Talking about politics',
  'Sporty lifestyle',
  'Keeping up with trends',
  'Bigger group better fun',
  'Meatlover over vegan',
  'Philosophical and spiritual topics',
  'Weekends are for parties',
  'Fascinated about arts',
  'Video Games',
  'Milkshakes over protein shakes',
  'Career is a high priority',
  'Interested in meditation',
  'Fan of social media',
  'Reading fiction over non-fiction',
  'Dark sense of humour',
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
