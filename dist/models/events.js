'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbGetEventTopYeahsNahs = exports.dbGetEventParticipants = exports.dbGetEventPersonality = exports.dbGetEventDetails = exports.dbCreateEvent = exports.dbGetEvents = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            },
          );
        }
      }
      return step('next');
    });
  };
}

const eventFields = [
  'events.id',
  'events.createdAt',
  'events.title',
  'events.eventImage',
  'events.description',
  'events.city',
  'events.address',
  'events.eventDate as date',
  'events.minParticipants',
  'events.maxParticipants as maxParticipants',
  'events.participantsMix',
  'events.hostId',
  'events.chatroomId',
];

const dbGetEvents = (exports.dbGetEvents = (() => {
  var _ref = _asyncToGenerator(function*(userId) {
    const loveTags = yield (0, _knex2.default)('user_tag')
      .where('userId', userId)
      .andWhere('love', true)
      .select(_knex2.default.raw('array_agg(DISTINCT "tagId") as tagsArray'))
      .then(function(res) {
        return res[0].tagsarray;
      });

    const hateTags = yield (0, _knex2.default)('user_tag')
      .where('userId', userId)
      .andWhere('love', false)
      .select(_knex2.default.raw('array_agg(DISTINCT "tagId") as tagsArray'))
      .then(function(res) {
        return res[0].tagsarray;
      });

    const userLocations = yield (0, _knex2.default)('user_location')
      .leftJoin('locations', 'locations.id', 'user_location.locationId')
      .where('userId', userId)
      .select(
        _knex2.default.raw(
          'array_agg(DISTINCT locations.name) as locationsArray',
        ),
      )
      .then(function(res) {
        return res[0].locationsarray;
      });

    const eventsWithLoveAndHateInCommon = yield (0, _knex2.default)('events')
      .select(_knex2.default.raw('array_agg(DISTINCT events.id) as eventids'))
      .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
      .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
      .whereIn('events.city', userLocations)
      .andWhere(
        _knex2.default.raw(
          `utlove."tagId" IN (${loveTags}) AND utlove."love" = true`,
        ),
      )
      .andWhere(
        _knex2.default.raw(
          `uthate."tagId" IN (${hateTags}) AND uthate."love" = false`,
        ),
      )
      .then(function(res) {
        return res[0].eventids ? res[0].eventids : [];
      });

    return _knex2.default
      .from(function() {
        this.select([
          ...eventFields,
          _knex2.default.raw(
            'count(DISTINCT participants."participantId") AS participants',
          ),
          _knex2.default.raw('count(DISTINCT utlove."tagId") AS loveCommon'),
          _knex2.default.raw('count(DISTINCT uthate."tagId") AS hateCommon'),
        ])
          .from('events')
          .leftJoin(
            'user_event as participants',
            'participants.eventId',
            'events.id',
          )
          .leftJoin('users', 'users.id', 'participants.participantId')
          .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
          .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
          .whereIn('events.city', userLocations)
          .andWhere(
            _knex2.default.raw(
              `utlove."tagId" IN (${loveTags}) AND utlove."love" = true`,
            ),
          )
          .andWhere(
            _knex2.default.raw(
              `uthate."tagId" IN (${hateTags}) AND uthate."love" = false`,
            ),
          )
          .as('filteredEvents')
          .groupBy('events.id');
      }, true)
      .union(function() {
        this.select([
          ...eventFields,
          _knex2.default.raw(
            'count(DISTINCT participants."participantId") AS participants',
          ),
          _knex2.default.raw(`0 AS loveCommon`),
          _knex2.default.raw(`0 AS hateCommon `),
        ])
          .from('events')
          .leftJoin(
            'user_event as participants',
            'participants.eventId',
            'events.id',
          )
          .leftJoin('users', 'users.id', 'participants.participantId')
          .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
          .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
          .whereIn('events.city', userLocations)
          .orWhere('events.hostId', userId)
          .whereNotIn('events.id', eventsWithLoveAndHateInCommon)
          .groupBy('events.id');
      }, true)
      .as('allEvents')
      .orderByRaw('participants DESC, date, loveCommon DESC, hateCommon DESC')
      .then(
        (() => {
          var _ref2 = _asyncToGenerator(function*(data) {
            for (let i = 0; i < data.length; i++) {
              yield _knex2.default
                .select('users.id', 'users.avatar', 'users.image')
                .from('users')
                .leftJoin('user_event', 'participantId', 'users.id')
                .where('eventId', data[i].id)
                .then(function(participantDetails) {
                  return (data[i].participantsDetails = participantDetails);
                });
            }
            return data;
          });

          return function(_x2) {
            return _ref2.apply(this, arguments);
          };
        })(),
      );
  });

  return function dbGetEvents(_x) {
    return _ref.apply(this, arguments);
  };
})());

const dbCreateEvent = (exports.dbCreateEvent = eventFields => {
  console.log(eventFields);
  return _knex2.default.transaction(
    (() => {
      var _ref3 = _asyncToGenerator(function*(trx) {
        const report = yield trx('events')
          .insert(eventFields)
          .returning('*')
          .then(function(results) {
            return results[0];
          });

        yield trx('user_event')
          .insert({
            participantId: report.hostId,
            eventId: report.id,
          })
          .then();

        const chatroom = yield trx('chatrooms')
          .insert({ creatorId: report.hostId, isEventChatroom: true })
          .returning('*')
          .then(function(results) {
            return results[0];
          });

        yield trx('user_chatroom')
          .insert({ chatroomId: chatroom.id, participantId: report.hostId })
          .returning('*')
          .then();

        yield trx('events')
          .update({ chatroomId: chatroom.id })
          .where({ id: report.id })
          .then();

        report.chatroomId = chatroom.id;

        return report;
      });

      return function(_x3) {
        return _ref3.apply(this, arguments);
      };
    })(),
  );
});

const dbGetEventDetails = (exports.dbGetEventDetails = (() => {
  var _ref4 = _asyncToGenerator(function*(eventId, userId) {
    const event = yield _knex2.default
      .select()
      .from('events')
      .where('id', eventId)
      .then(function(data) {
        return data[0];
      });

    const eventParticipants = yield dbGetEventParticipants(event, userId);
    const eventTopTags = yield dbGetEventTopYeahsNahs(eventId);
    const eventPersonality = yield dbGetEventPersonality(eventId);

    event.eventParticipants = eventParticipants;
    event.eventTopTags = eventTopTags;
    event.eventPersonality = eventPersonality;

    return event;
  });

  return function dbGetEventDetails(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
})());

const dbGetEventPersonality = (exports.dbGetEventPersonality = (() => {
  var _ref5 = _asyncToGenerator(function*(eventId) {
    const topEventPersonalities = yield _knex2.default
      .raw(`SELECT "name", COUNT("user_event"."participantId")  as "Number_of_Personalities"   FROM events
  JOIN "user_event" ON events.id = "user_event"."eventId"
  JOIN "user_personality"  ON "user_personality"."userId" =  "user_event"."participantId"
  JOIN "personalities" ON "user_personality"."personalityId" = "personalities"."id"
  WHERE "user_event"."eventId" = ${eventId}
  GROUP BY "personalities"."name"
  ORDER BY "Number_of_Personalities" DESC
  LIMIT 3`);
    return topEventPersonalities.rows;
  });

  return function dbGetEventPersonality(_x6) {
    return _ref5.apply(this, arguments);
  };
})());

const dbGetEventParticipants = (exports.dbGetEventParticipants = (() => {
  var _ref6 = _asyncToGenerator(function*(event, userId) {
    const hateCommonLoveCommon = yield _knex2.default
      .raw(`SELECT "users"."id","users"."avatar","users"."username",
    count(DISTINCT "tags"."name") AS "hateCommon"
    FROM "users"
    left join "user_tag"
    ON "user_tag"."userId" = "users"."id"
    left join "tags"
    ON "tags"."id" = "user_tag"."tagId"
    WHERE "user_tag"."love" = ${false}
    AND "users"."id" IN (SELECT "users"."id"  FROM "users"
          left join "user_event"
          ON "user_event"."participantId" = "users"."id"
          left join "events"
          ON "events"."id" = "user_event"."eventId"
          WHERE "user_event"."eventId" = ${event.id})
    AND "tags"."name" IN (SELECT "tags"."name" FROM "user_tag"
                      left join "tags" ON "tags"."id" = "user_tag"."tagId"
                      WHERE "user_tag"."userId" = ${userId}
                      AND "user_tag"."love" = ${false})
    GROUP BY "users"."id"`);

    const loveCommon = yield _knex2.default
      .raw(`SELECT "users"."id","users"."username",
      count(DISTINCT "tags"."name") AS "loveCommon"
      FROM "users"
      left join "user_tag"
      ON "user_tag"."userId" = "users"."id"
      left join "tags"
      ON "tags"."id" = "user_tag"."tagId"
      WHERE "user_tag"."love" = ${true}
      AND "users"."id" != ${userId}
      AND "users"."id" IN (SELECT "users"."id"  FROM "users"
            left join "user_event"
            ON "user_event"."participantId" = "users"."id"
            left join "events"
            ON "events"."id" = "user_event"."eventId"
            WHERE "user_event"."eventId" = ${event.id})
      AND "tags"."name" IN (SELECT "tags"."name" FROM "user_tag"
                        left join "tags" ON "tags"."id" = "user_tag"."tagId"
                        WHERE "user_tag"."userId" = ${userId}
                        AND "user_tag"."love" = ${true})
      GROUP BY "users"."id"`);

    hateCommonLoveCommon.rows.map(function(hate) {
      loveCommon.rows.map(function(love) {
        if (love.id === hate.id) {
          hate.loveCommon = love.loveCommon;
        }
      });
    });
    hateCommonLoveCommon.rows.map(function(user, index) {
      if (user.id == event.hostId) {
        const hostUser = user;
        hateCommonLoveCommon.rows.splice(index, index + 1);
        hateCommonLoveCommon.rows.unshift(hostUser);
      }
    });
    return hateCommonLoveCommon.rows;
  });

  return function dbGetEventParticipants(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
})());

const dbGetEventTopYeahsNahs = (exports.dbGetEventTopYeahsNahs = (() => {
  var _ref7 = _asyncToGenerator(function*(eventId) {
    const topEventYeahs = yield _knex2.default
      .raw(`SELECT "tags"."name", COUNT("user_event"."participantId")  FROM events
    JOIN "user_event" ON events.id = "user_event"."eventId"
    JOIN "user_tag"  ON "user_tag"."userId" =  "user_event"."participantId"
    JOIN "tags" ON "tags"."id" = "user_tag"."tagId"
    WHERE "user_event"."eventId" = ${eventId}
    AND "user_tag".love = true
    GROUP BY "tags"."name"
    ORDER BY COUNT DESC
    LIMIT 3`);

    const topEventNahs = yield _knex2.default
      .raw(`SELECT "tags"."name", COUNT("user_event"."participantId")  FROM events
    JOIN "user_event" ON events.id = "user_event"."eventId"
    JOIN "user_tag"  ON "user_tag"."userId" =  "user_event"."participantId"
    JOIN "tags" ON "tags"."id" = "user_tag"."tagId"
    WHERE "user_event"."eventId" = ${eventId}
    AND "user_tag".love = false
    GROUP BY "tags"."name"
    ORDER BY COUNT DESC
    LIMIT 3`);

    topEventYeahs.rows.map(function(yeah) {
      yeah.love = true;
    });

    topEventNahs.rows.map(function(nah) {
      nah.love = false;
    });

    const topYeahsNahs = topEventYeahs.rows.concat(topEventNahs.rows);

    return topYeahsNahs;
  });

  return function dbGetEventTopYeahsNahs(_x9) {
    return _ref7.apply(this, arguments);
  };
})());
//# sourceMappingURL=events.js.map
