import { dbInsertAppFeedback } from '../models/feedback';

export const insertAppFeedback = (request, reply) => {
  return dbInsertAppFeedback(
    request.payload.feedback,
    request.pre.user.id,
  ).then(() => reply.response());
};
