import {
  dbGetUsers,
  dbToggleAccountActivation,
} from '../../models/admin/users';

export const getUsers = (request, reply) => {
  return dbGetUsers().then(data => reply.response(data));
};

export const toggleAccountActivation = async (request, reply) => {
  return dbToggleAccountActivation(
    request.params.userId,
    request.payload.toggleTo,
  ).then(data => reply.response(data));
};
