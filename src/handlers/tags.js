import {
  dbGetTags,
  dbGetUserTags,
  dbRegisterTags,
  dbUpdateUserTags,
  dbGetTagsWithUnseenFlag,
  dbUserSeenTags,
} from '../models/tags';

export const getTags = (request, reply) =>
  dbGetTags().then(data => reply.response(data));

export const getTagsWithUnseenFlag = (request, reply) =>
  dbGetTagsWithUnseenFlag(request.pre.user.id).then(data =>
    reply.response(data),
  );

export const userSeenTags = (request, reply) =>
  dbUserSeenTags(request.pre.user.id).then(() => reply.response());

export const getUserTags = (request, reply) =>
  dbGetUserTags(request.query.userId, request.pre.user.id).then(data =>
    reply.response(data),
  );

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

export const updateUserTags = (request, reply) =>
  dbUpdateUserTags(
    request.payload.lovedTags,
    request.payload.hatedTags,
    request.pre.user.id,
  ).then(data => reply.response(data));
