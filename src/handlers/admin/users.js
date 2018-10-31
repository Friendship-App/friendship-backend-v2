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

export const banUser = (request, reply) => {
  if (
    request.pre.user.scope !== 'admin' &&
    request.pre.user.id !== request.params.userId
  ) {
    return reply(
      Boom.unauthorized("You don't have the permissions to do this action"),
    );
  }

  const fields = {
    user_id: request.payload.userId,
    banned_by: request.pre.user.id,
    reason: request.payload.reason,
    expire:
      !request.payload.expire || request.payload.expire === 'x'
        ? null
        : moment()
            .add(
              request.payload.expire.split(':')[0],
              request.payload.expire.split(':')[1],
            )
            .utc()
            .toISOString(),
  };

  return dbFetchUserBan(request.params.userId).then(result => {
    if (result.length) return reply(Boom.conflict('User is already banned'));

    return dbBanUser(request.params.userId, fields).then(reply);
  });
};
