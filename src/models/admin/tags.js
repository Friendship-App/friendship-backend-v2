import knex from '../../utils/knex';
import moment from 'moment';

export const dbGetTags = () => {
  return knex('tags').select('*');
};

export const dbDeleteTag = tagId => {
  return knex('tags')
    .del()
    .where({ id: tagId })
    .returning('*');
};

export const dbAddTag = (newTagData, creatorId) => {
  console.log(creatorId);
  return knex
    .insert({
      creatorId,
      name: newTagData.name,
      createdAt: moment(),
    })
    .into('tags')
    .returning('*');
};
