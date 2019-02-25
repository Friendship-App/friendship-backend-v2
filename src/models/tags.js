import knex from '../utils/knex';
import { isEmpty, find } from 'lodash';

export const dbGetTags = () => knex.select().from('tags');

export const dbGetActivities = () =>
  knex
    .select()
    .from('tags')
    .where('category', 1);

function getTagsDetails(tags = []) {
  return knex
    .select()
    .from('tags')
    .whereIn('id', tags);
}

const getUserTagsByAnswer = (userTags, love) =>
  userTags.filter(tag => tag.love === love).map(({ tagId }) => tagId);

export const dbGetUserTags = async (idOfUserAskedFor, userId) => {
  let commonTagPercent;
  const isLoggedInUser = idOfUserAskedFor == userId;

  const tagsOfUserAskedFor = await getUserTags(idOfUserAskedFor);
  let loveTags = getUserTagsByAnswer(tagsOfUserAskedFor, true);
  let hateTags = getUserTagsByAnswer(tagsOfUserAskedFor, false);

  if (!isLoggedInUser) {
    const userTags = await getUserTags(userId);

    const commonTags = userTags.filter(userTag =>
      find(tagsOfUserAskedFor, ({ tagId }) => tagId === userTag.tagId),
    );

    const tagsWithSameAnswer = commonTags.filter(commonTag =>
      find(tagsOfUserAskedFor, commonTag),
    );
    commonTagPercent = tagsWithSameAnswer.length
      ? Math.round((tagsWithSameAnswer.length / commonTags.length) * 100)
      : 0;
  }

  if (!isEmpty(loveTags)) {
    loveTags = await getTagsDetails(loveTags);
  }

  if (!isEmpty(hateTags)) {
    hateTags = await getTagsDetails(hateTags);
  }

  return { loveTags, hateTags, commonTagPercent };
};

export const dbRegisterTags = userTags =>
  knex.insert(userTags).into('user_tag');

export function getUserTags(userId) {
  return knex('user_tag')
    .select('tagId', 'love')
    .where('userId', userId);
}

export const dbUpdateUserTags = (lovedTags, hatedTags, userId) =>
  knex.transaction(async trx => {
    console.log(lovedTags);
    console.log(hatedTags);
    await trx
      .del()
      .from('user_tag')
      .where({ userId });

    const updatedTags = [];
    lovedTags.map(tag => updatedTags.push({ userId, tagId: tag, love: true }));
    hatedTags.map(tag => updatedTags.push({ userId, tagId: tag, love: false }));

    return trx
      .insert(updatedTags)
      .into('user_tag')
      .returning('*');
  });
