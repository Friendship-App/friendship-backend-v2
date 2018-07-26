import {
  dbGetUserInformation,
  dbGetUsersBatch,
  dbRegisterNotificationToken,
  dbUpdateAccount,
  dbUpdateProfile,
} from '../models/users';

export const getBatchUsers = (request, reply) => {
  return dbGetUsersBatch(
    request.params.batchSize,
    request.pre.user.id,
    request.payload.usersAlreadyFetched,
  ).then(data => reply.response(data));
};

export const getUserInformation = (request, reply) => {
  return dbGetUserInformation(request.query.userId).then(data =>
    reply.response(data),
  );
};

export const registerNotificationToken = (request, reply) => {
  return dbRegisterNotificationToken(
    request.payload.userId,
    request.payload.token,
  ).then(reply);
};

export const updateProfile = (request, reply) => {
  return dbUpdateProfile(request.payload, request.pre.user.id).then(user =>
    reply.response(user),
  );
};

export const updateAccount = (request, reply) => {
  return dbUpdateAccount(request.payload, request.pre.user.id).then(user =>
    reply.response(user),
  );
};
