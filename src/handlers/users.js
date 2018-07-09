import { dbGetUsers } from '../models/users';

export const getUsers = (request, reply) =>
  dbGetUsers().then(data => reply.response(data));
