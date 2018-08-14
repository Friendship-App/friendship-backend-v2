import knex from '../utils/knex';
import moment from 'moment';

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

export const dbGetEvents = async userId => {
  const loveTags = await knex('user_tag')
    .where('userId', userId)
    .andWhere('love', true)
    .select(knex.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });

  const hateTags = await knex('user_tag')
    .where('userId', userId)
    .andWhere('love', false)
    .select(knex.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });

  const userLocations = await knex('user_location')
    .leftJoin('locations', 'locations.id', 'user_location.locationId')
    .where('userId', userId)
    .select(knex.raw('array_agg(DISTINCT locations.name) as locationsArray'))
    .then(res => {
      return res[0].locationsarray;
    });

  const eventsWithLoveAndHateInCommon = await knex('events')
    .select(knex.raw('array_agg(DISTINCT events.id) as eventids'))
    .leftJoin('user_tag as utlove', 'utlove.userId', 'events.hostId')
    .leftJoin('user_tag as uthate', 'uthate.userId', 'events.hostId')
    .whereIn('events.city', userLocations)
    .andWhere(
      knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`),
    )
    .andWhere(
      knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`),
    )
    .then(res => (res[0].eventids ? res[0].eventids : []));

  return knex
    .from(function() {
      this.select([
        ...eventFields,
        knex.raw(
          'count(DISTINCT participants."participantId") AS participants',
        ),
        knex.raw('count(DISTINCT utlove."tagId") AS loveCommon'),
        knex.raw('count(DISTINCT uthate."tagId") AS hateCommon'),
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
          knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`),
        )
        .andWhere(
          knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`),
        )
        .as('filteredEvents')
        .groupBy('events.id');
    }, true)
    .union(function() {
      this.select([
        ...eventFields,
        knex.raw(
          'count(DISTINCT participants."participantId") AS participants',
        ),
        knex.raw(`0 AS loveCommon`),
        knex.raw(`0 AS hateCommon `),
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
        // .orWhere('events.hostId', userId)
        .whereNotIn('events.id', eventsWithLoveAndHateInCommon)
        .groupBy('events.id');
    }, true)
    .as('allEvents')
    .orderByRaw('participants DESC, date, loveCommon DESC, hateCommon DESC')
    .then(async data => {
      for (let i = 0; i < data.length; i++) {
        await knex
          .select('users.id', 'users.mood', 'users.image', 'users.username')
          .from('users')
          .leftJoin('user_event', 'participantId', 'users.id')
          .where('eventId', data[i].id)
          .then(
            participantDetails =>
              (data[i].participantsDetails = participantDetails),
          );
      }
      return data;
    });
};

export const dbCreateEvent = eventFields => {
  return knex.transaction(async trx => {
    const report = await trx('events')
      .insert(eventFields)
      .returning('*')
      .then(results => results[0]);

    await trx('user_event')
      .insert({
        participantId: report.hostId,
        eventId: report.id,
      })
      .then();

    const chatroom = await trx('chatrooms')
      .insert({ creatorId: report.hostId, isEventChatroom: true })
      .returning('*')
      .then(results => results[0]);

    await trx('user_chatroom')
      .insert({ chatroomId: chatroom.id, participantId: report.hostId })
      .returning('*')
      .then();

    await trx('events')
      .update({ chatroomId: chatroom.id })
      .where({ id: report.id })
      .then();

    report.chatroomId = chatroom.id;

    return report;
  });
};

export const dbGetEventDetails = async (eventId, userId) => {
  const event = await knex
    .select()
    .from('events')
    .where('id', eventId)
    .then(data => data[0]);

  const eventParticipants = await dbGetEventParticipants(event, userId);
  const eventTopTags = await dbGetEventTopYeahsNahs(eventId);
  const eventPersonality = await dbGetEventPersonality(eventId);

  event.eventParticipants = eventParticipants;
  event.eventTopTags = eventTopTags;
  event.eventPersonality = eventPersonality;

  return event;
};

export const dbGetEventPersonality = async eventId => {
  const topEventPersonalities = await knex.raw(`SELECT "name", COUNT("user_event"."participantId")  as "Number_of_Personalities"   FROM events
  JOIN "user_event" ON events.id = "user_event"."eventId"
  JOIN "user_personality"  ON "user_personality"."userId" =  "user_event"."participantId"
  JOIN "personalities" ON "user_personality"."personalityId" = "personalities"."id"
  WHERE "user_event"."eventId" = ${eventId}
  GROUP BY "personalities"."name"
  ORDER BY "Number_of_Personalities" DESC
  LIMIT 3`);
  return topEventPersonalities.rows;
};

export const dbGetEventParticipants = async (event, userId) => {
  const hateCommonLoveCommon = await knex.raw(`SELECT "users"."id","users"."mood","users"."username","users"."image",
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

  const loveCommon = await knex.raw(`SELECT "users"."id","users"."username","users"."image",
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

  hateCommonLoveCommon.rows.map(hate => {
    loveCommon.rows.map(love => {
      if (love.id === hate.id) {
        hate.loveCommon = love.loveCommon;
      }
    });
  });
  hateCommonLoveCommon.rows.map((user, index) => {
    if (user.id == event.hostId) {
      const hostUser = user;
      hateCommonLoveCommon.rows.splice(index, index + 1);
      hateCommonLoveCommon.rows.unshift(hostUser);
    }
  });

  return hateCommonLoveCommon.rows;
};

export const dbGetEventTopYeahsNahs = async eventId => {
  const topEventYeahs = await knex.raw(`SELECT "tags"."name", COUNT("user_event"."participantId")  FROM events
    JOIN "user_event" ON events.id = "user_event"."eventId"
    JOIN "user_tag"  ON "user_tag"."userId" =  "user_event"."participantId"
    JOIN "tags" ON "tags"."id" = "user_tag"."tagId"
    WHERE "user_event"."eventId" = ${eventId}
    AND "user_tag".love = true
    GROUP BY "tags"."name"
    ORDER BY COUNT DESC
    LIMIT 3`);

  const topEventNahs = await knex.raw(`SELECT "tags"."name", COUNT("user_event"."participantId")  FROM events
    JOIN "user_event" ON events.id = "user_event"."eventId"
    JOIN "user_tag"  ON "user_tag"."userId" =  "user_event"."participantId"
    JOIN "tags" ON "tags"."id" = "user_tag"."tagId"
    WHERE "user_event"."eventId" = ${eventId}
    AND "user_tag".love = false
    GROUP BY "tags"."name"
    ORDER BY COUNT DESC
    LIMIT 3`);

  topEventYeahs.rows.map(yeah => {
    yeah.love = true;
  });

  topEventNahs.rows.map(nah => {
    nah.love = false;
  });

  const topYeahsNahs = topEventYeahs.rows.concat(topEventNahs.rows);

  return topYeahsNahs;
};

export const dbJoinEvent = (eventId, userId) =>
  knex
    .insert({ participantId: userId, eventId })
    .into('user_event')
    .returning('*');

export const dbLeaveEvent = (eventId, userId) =>
  knex
    .del()
    .from('user_event')
    .where({ participantId: userId, eventId });
