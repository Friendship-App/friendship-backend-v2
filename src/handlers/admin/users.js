import { dbGetUsers } from '../../models/admin/users';

export const getUsers = (request, reply) => {
  return dbGetUsers().then(data => reply.response(data));
};
