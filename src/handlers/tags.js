import {
  dbGetActivities,
  dbGetInterests,
  dbRegisterTags,
} from '../models/tags';

export const getInterests = (request, reply) =>
  dbGetInterests().then(data => reply.response(data));

export const getActivities = (request, reply) =>
  dbGetActivities().then(data => reply.response(data));

export const registerTags = (userId, lovedTags, hatedTags) => {
  let userTags = [];
  userTags = formatTags(userId, lovedTags, userTags, true);
  userTags = formatTags(userId, hatedTags, userTags, false);
  console.log(userTags);
  return dbRegisterTags(userTags);
};

function formatTags(userId, tags, userTags, love) {
  const tmpUserTags = userTags;
  tags.map(tag => tmpUserTags.push({ userId, tagId: tag, love }));
  return tmpUserTags;
}
