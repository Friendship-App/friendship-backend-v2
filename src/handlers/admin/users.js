import {
  dbDeleteUser,
  dbGetUsers,
  dbToggleAccountActivation,
} from '../../models/admin/users';

export const getUsers = (request, reply) => {
  return dbGetUsers(request.query.username).then(data => reply.response(data));
};

export const toggleAccountActivation = (request, reply) => {
  return dbToggleAccountActivation(
    request.params.userId,
    request.payload.toggleTo,
  ).then(data => reply.response(data));
};

export const deleteUser = (request, reply) => {
  return dbDeleteUser(request.params.userId).then(data => reply.response(data));
};
