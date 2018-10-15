'use strict';

import cron from 'node-cron';
import {
  dbUserLastActive,
  dbUpdateRegisteredUsersData,
  dbUpdateActiveUsersData,
  dbUpDateActiveConversationsData,
  dbUpdateAverageConversationsLength,
} from '../models/metrics';

// Cron job runs every minute so metrics are populated and there is smth to show on metrics
cron.schedule('1 * * * * *', async () => {
  try {
    await dbUpdateRegisteredUsersData();
    await dbUpdateActiveUsersData();
    await dbUpDateActiveConversationsData();
    await dbUpdateAverageConversationsLength();
  } catch (e) {
    console.log('error with Cron: ', e);
  }
});

const metrics = {
  name: 'metrics',
  version: '1.0.0',
  register: async function(server, options) {
    server.ext('onPostHandler', async (request, reply) => {
      const user = request.pre.user;

      if (user) {
        // for each request that a user make it will update the last active field
        await dbUserLastActive(user.id);
      }

      return reply.continue;
    });
  },
};

export default metrics;
