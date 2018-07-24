const simpleFixtures = require('simple-fixtures');

let userId = 1;
let eventId = 0;
const eventParticipantsFields = {
  participantId: () => {
    userId += 1;
    if (userId > 4) {
      eventId = 1;
    } else {
      eventId = 0;
    }
    return userId;
  },
  eventId: () => {
    eventId += 1;
    return eventId;
  },
};

exports.seed = knex =>
  knex.batchInsert(
    'user_event',
    simpleFixtures.generateFixtures(eventParticipantsFields, 8),
  );
