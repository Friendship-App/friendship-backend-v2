import knex from '../../utils/knex';
import { notifyEventCancelled } from '../../utils/notifications';

const eventsFields = [
  'events.id',
  'events.createdAt',
  'events.title',
  'events.eventImage',
  'events.description',
  'events.active',
];

export const dbGetEvents = title => {
  return knex('events')
    .leftJoin('event_reports', 'event_reports.eventId', 'events.id')
    .select(eventsFields)
    .count('event_reports.id as reports')
    .whereRaw(`LOWER(events.title) LIKE LOWER('%${title}%')`)
    .groupBy('events.id', 'event_reports.id')
    .orderBy('events.id', 'asc');
};

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
