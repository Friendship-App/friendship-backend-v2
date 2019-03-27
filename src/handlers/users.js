import {
  dbDeleteUser,
  dbGetUserInformation,
  dbGetUsersBatch,
  dbRegisterNotificationToken,
  dbReportUser,
  dbUpdateAccount,
  dbUpdateProfile,
} from '../models/users';

export const getBatchUsers = (request, reply) => {
  return dbGetUsersBatch(request.params.batchSize, request.pre.user.id).then(
    data => reply.response(data),
  );
};

export const getUserInformation = (request, reply) => {
  const isOwnProfile = request.pre.user.id.toString() === request.query.userId;
  return dbGetUserInformation(request.query.userId, isOwnProfile).then(data =>
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

export const reportUser = (request, reply) => {
  return dbReportUser(request.payload, request.pre.user.id).then(data =>
    reply.response(data),
  );
};

export const deleteUser = (request, reply) => {
  return dbDeleteUser(request.pre.user.id).then(data => reply.response(data));
};
