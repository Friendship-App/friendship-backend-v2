import { dbGetUserInformation, dbGetUsersBatch } from '../models/users';

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
