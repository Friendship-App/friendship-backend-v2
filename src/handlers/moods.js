import { dbGetMoods } from '../models/moods';

export const getMoods = (request, reply) =>
  dbGetMoods().then(data => reply.response(data));
