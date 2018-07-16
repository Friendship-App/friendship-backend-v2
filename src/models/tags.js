import knex from '../utils/knex';
import { merge } from 'lodash';

export const dbGetInterests = () =>
  knex
    .select()
    .from('tags')
    .where('category', 2);

export const dbGetActivities = () =>
  knex
    .select()
    .from('tags')
    .where('category', 1);

export function getUserLove(userId) {
  return knex('user_tag')
    .where('userId', userId)
    .andWhere('love', true)
    .select(knex.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });
}

export function getUserHate(userId) {
  return knex('user_tag')
    .where('userId', userId)
    .andWhere('love', false)
    .select(knex.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });
}

function getTagsDetails(tags) {
  return knex
    .select()
    .from('tags')
    .whereIn('id', tags);
}

export const dbGetUserTags = async (idOfUserAskedFor, userId) => {
  let loveTags = await getUserLove(idOfUserAskedFor);
  let hateTags = await getUserHate(idOfUserAskedFor);

  const loveInCommon = await getTagInCommon(loveTags, userId, true);
  const hateInCommon = await getTagInCommon(hateTags, userId, false);

  loveTags = await getTagsDetails(loveTags);
  hateTags = await getTagsDetails(hateTags);

  const userTags = merge(
    {},
    { loveTags, hateTags, loveInCommon, hateInCommon },
  );
  return userTags;
};

export const dbRegisterTags = userTags =>
  knex.insert(userTags).into('user_tag');

function getTagInCommon(tags, idOfUserAskedFor, love) {
  return knex
    .count()
    .from('user_tag')
    .whereIn('tagId', tags)
    .andWhere('userId', idOfUserAskedFor)
    .andWhere('love', love)
    .then(data => data[0].count);
}
