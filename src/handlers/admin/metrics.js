import {
  dbDisplayRegisteredUsersData,
  dbUpdateRegisteredUsersData,
  dbDisplayActiveUsersData,
  dbUpdateActiveUsersData,
  dbDisplayActiveConversationData,
  dbUpDateActiveConversationsData,
  dbDisplayAverageConversationsLength,
  dbUpdateAverageConversationsLength,
  dbDisplayAllMetrics,
  dbDisplayWeekMetrics,
  dbDisplayMonthMetrics,
} from '../../models/admin/metrics';

export const updateRegisteredUsers = (request, reply) => {
  return dbUpdateRegisteredUsersData().then(data => reply.response(data));
};

export const displayRegisteredUsers = (request, reply) => {
  return dbDisplayRegisteredUsersData().then(data => reply.response(data));
};

export const displayActiveUsers = (request, reply) => {
  return dbDisplayActiveUsersData().then(data => reply.response(data));
};

export const updateActiveUsers = (request, reply) => {
  return dbUpdateActiveUsersData().then(data => reply.response(data));
};

export const displayActiveConversation = (request, reply) => {
  return dbDisplayActiveConversationData().then(data => reply.response(data));
};

export const updateActiveConversations = (request, reply) => {
  return dbUpDateActiveConversationsData().then(data => reply.response(data));
};

export const displayConversationsLength = (request, reply) => {
  return dbDisplayAverageConversationsLength().then(data =>
    reply.response(data),
  );
};

export const updateAverageConversationsLength = (request, reply) => {
  return dbUpdateAverageConversationsLength().then(data =>
    reply.response(data),
  );
};

export const displayAllMetrics = (request, reply) =>
  dbDisplayAllMetrics().then(data => reply.response(data));

export const displayWeekMetrics = (request, reply) =>
  dbDisplayWeekMetrics().then(data => reply.response(data));

export const displayMonthMetrics = (request, reply) =>
  dbDisplayMonthMetrics().then(data => reply.response(data));

export const testMetrics = async (request, reply) => {
  try {
    await dbUpdateRegisteredUsersData();
    await dbUpdateActiveUsersData();
    await dbUpDateActiveConversationsData();
    await dbUpdateAverageConversationsLength();
    return reply.response('Test metrics successful');
  } catch (e) {
    return reply.response(`Error: ${e}`);
  }
};
