import {
  dbGetUserInformation,
  dbGetUsersBatch,
  dbRegisterNotificationToken,
} from '../models/users';

export const getBatchUsers = (request, reply) => {
  return dbGetUsersBatch(request.params.batchSize, request.pre.user.id).then(
    data => reply.response(data),
  );
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
