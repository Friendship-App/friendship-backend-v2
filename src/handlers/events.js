import {
  dbCreateEvent,
  dbDeleteEvent,
  dbGetEventDetails,
  dbGetEvents,
  dbJoinEvent,
  dbLeaveEvent,
  dbUpdateEvent,
} from '../models/events';
import moment from 'moment';

export const getEvents = (request, reply) =>
  dbGetEvents(request.pre.user.id).then(res => {
    const events = res;
    for (let i = events.length - 1; i > -1; i--) {
      if (
        moment(moment(events[i].date).format()).isBefore(request.params.time) ||
        events[i].maxParticipants <= events[i].participants
      ) {
        events.splice(i, 1);
      }
    }
    return reply.response(events);
  });

export const createEvent = (request, reply) =>
  dbCreateEvent(request.payload).then(event => reply.response(event));

export const getEventDetails = (request, reply) =>
  dbGetEventDetails(request.params.eventId, request.pre.user.id).then(data =>
    reply.response(data),
  );

export const joinEvent = (request, reply) =>
  dbJoinEvent(request.params.eventId, request.pre.user.id).then(data =>
    reply.response(data),
  );

export const leaveEvent = (request, reply) =>
  dbLeaveEvent(request.params.eventId, request.pre.user.id).then(data =>
    reply.response(data),
  );

export const updateEvent = (request, reply) =>
  dbUpdateEvent(request.payload.eventData, request.payload.eventId).then(
    event => reply.response(event),
  );

export const deleteEvent = (request, reply) => {
  return dbDeleteEvent(request.params.eventId, request.pre.user.id).then(data =>
    reply.response(data),
  );
};
