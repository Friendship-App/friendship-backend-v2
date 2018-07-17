import { dbGetEvents } from '../models/events';

export const getEvents = (request, reply) =>
  dbGetEvents(request.pre.user.id).then(data => reply.response(data));
