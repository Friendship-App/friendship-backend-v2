import knex from '../../utils/knex';
import moment from 'moment';

export const dbGetTags = () => {
  return knex('tags')
    .select('*')
    .orderBy('tags.id');
};

export const dbDeleteTag = tagId => {
  return knex('tags')
    .del()
    .where({ id: tagId })
    .returning('*');
};

export const dbAddTag = (newTagData, creatorId) => {
  return knex
    .insert({
      creatorId,
      name: newTagData.name,
      createdAt: moment(),
    })
    .into('tags')
    .returning('*');
};

export const dbUpdateTag = (tagId, name) => {
  return knex
    .update({ name })
    .from('tags')
    .where({ id: tagId });
};
