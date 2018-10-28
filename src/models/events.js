import knex from '../utils/knex';
import { notifyEventCancelled } from '../utils/notifications';
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
  'events.active',
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
    .andWhere('events.active', true)
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
        .andWhere('events.active', true)
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
        .andWhere('events.active', true)
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
          .andWhere('users.active', true)
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
  const participants = await knex('users')
    .innerJoin('user_event', 'users.id', 'user_event.participantId')
    .where('user_event.eventId', event.id)
    .select(['users.id', 'users.mood', 'users.username', 'users.image']);

  participants.sort(
    (a, b) => (a.id === event.hostId ? -1 : b.id === event.hostId ? 1 : 0),
  );

  const userLoveTags = (await knex('user_tag')
    .select('tagId')
    .where({ userId, love: true })).map(x => x.tagId);
  const userHateTags = (await knex('user_tag')
    .select('tagId')
    .where({ userId, love: false })).map(x => x.tagId);
  const promises = participants.map(async participant => {
    if (participant.id === userId) return Promise.resolve();

    const loveCommon = await knex.raw(
      'select count("tagId") as count from user_tag where "userId" = ? and "tagId" = any(?)',
      [participant.id, userLoveTags],
    );
    participant.loveCommon = loveCommon.rows[0].count;

    const hateCommon = await knex.raw(
      'select count("tagId") as count from user_tag where "userId" = ? and "tagId" = any(?)',
      [participant.id, userHateTags],
    );
    participant.hateCommon = hateCommon.rows[0].count;

    return participant;
  });
  await Promise.all(promises);

  return participants;
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

export const dbJoinEvent = (eventId, userId) => {
  return knex.transaction(async trx => {
    await trx
      .insert({ participantId: userId, eventId })
      .into('user_event')
      .returning('*');

    const event = await trx
      .select()
      .from('events')
      .where({ id: eventId })
      .then(events => events[0]);
    return trx
      .insert({ chatroomId: event.chatroomId, participantId: userId })
      .into('user_chatroom')
      .returning('*');
  });
};

export const dbLeaveEvent = (eventId, userId) => {
  return knex.transaction(async trx => {
    const event = await trx
      .select()
      .from('events')
      .where({ id: eventId })
      .then(events => events[0]);
    await trx
      .del()
      .from('user_chatroom')
      .where({ participantId: userId, chatroomId: event.chatroomId });

    return trx
      .del()
      .from('user_event')
      .where({ participantId: userId, eventId });
  });
};

export const dbUpdateEvent = (eventData, eventId) =>
  knex.transaction(async trx => {
    return trx('events')
      .update(eventData)
      .where({ id: eventId });
  });

export const dbDeleteEvent = (eventId, userId) => {
  return knex.transaction(async trx => {
    const participantsToken = await trx('user_event')
      .leftJoin('users', 'users.id', 'user_event.participantId')
      .whereNot({ participantId: userId })
      .andWhere({ eventId })
      .select('notificationToken');
    const cancelledEvent = await trx
      .select()
      .from('events')
      .where({ id: eventId })
      .then(events => events[0]);
    notifyEventCancelled(participantsToken, cancelledEvent);
    return trx
      .del()
      .from('events')
      .where({ id: eventId });
  });
};

export const dbReportEvent = (data, reporterId) => {
  return knex
    .insert({
      eventId: data.eventId,
      description: data.reason,
      createdAt: moment(),
      reported_by: reporterId,
    })
    .into('event_reports')
    .returning('*');
};
