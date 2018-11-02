import { dbGetTotalFeedbacks } from '../../models/admin/feedback';

export const getTotalFeedbacks = (request, reply) => {
  return dbGetTotalFeedbacks().then(data => reply.response(data));
};
