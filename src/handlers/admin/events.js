import { dbDeleteEvent, dbGetEvents } from '../../models/admin/events';

export const getEvents = (request, reply) => {
  return dbGetEvents(request.query.title).then(data => reply.response(data));
};

export const deleteEvent = (request, reply) => {
  return dbDeleteEvent(request.params.eventId, request.pre.user.id).then(data =>
    reply.response(data),
  );
};
