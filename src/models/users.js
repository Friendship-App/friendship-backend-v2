import knex from '../utils/knex';
import { merge } from 'lodash';
import { getUserHate, getUserLove } from './tags';

const userListFields = [
  'users.id',
  'users.createdAt',
  'users.lastActive',
  'users.email',
  'users.scope',
  'users.username',
  'users.description',
  'users.avatar',
  'users.compatibility',
  'users.active',
  'users.birthyear',
  'users.status',
  'users.image',
];

function getUserLocations(userId) {
  return knex('user_location')
    .leftJoin('locations', 'locations.id', 'user_location.locationId')
    .where('userId', userId)
    .select(knex.raw('array_agg(DISTINCT locations.id) as locationsArray'))
    .then(res => {
      return res[0].locationsarray;
    });
}

export const dbGetUsersBatch = async (pageNumber, userId) => {
  const pageLimit = 10;
  const offset = pageNumber * pageLimit;

  const loveTags = await getUserLove(userId);
  const hateTags = await getUserHate(userId);

  const userLocations = await getUserLocations(userId);

  const usersAlreadyFetched = await knex('users')
    .select(knex.raw('array_agg(DISTINCT users.id) as arr'))
    .leftJoin('user_gender', 'user_gender.userId', 'users.id')
    .leftJoin('genders', 'genders.id', 'user_gender.genderId')
    .leftJoin('user_location', 'user_location.userId', 'users.id')
    .leftJoin('locations', 'locations.id', 'user_location.locationId')
    .leftJoin('user_tag as utlove', 'utlove.userId', 'users.id')
    .leftJoin('user_tag as uthate', 'uthate.userId', 'users.id')
    .whereIn('user_location.locationId', userLocations)
    .andWhereNot('users.id', userId)
    .andWhere('users.scope', 'user')
    .andWhere(
      knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`),
    )
    .andWhere(
      knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`),
    )
    .limit(offset)
    .then(res => {
      return res.length > 0 ? res[0].arr : [];
    });

  return knex
    .from(function() {
      this.select([
        ...userListFields,
        knex.raw('array_agg(DISTINCT "gender") AS genders'),
        knex.raw('array_agg(DISTINCT locations.name) AS locations'),
        knex.raw('count(DISTINCT utlove."tagId") AS loveCommon'),
        knex.raw('count(DISTINCT uthate."tagId") AS hateCommon'),
      ])
        .from('users')
        .leftJoin('user_gender', 'user_gender.userId', 'users.id')
        .leftJoin('genders', 'genders.id', 'user_gender.genderId')
        .leftJoin('user_location', 'user_location.userId', 'users.id')
        .leftJoin('locations', 'locations.id', 'user_location.locationId')
        .leftJoin('user_tag as utlove', 'utlove.userId', 'users.id')
        .leftJoin('user_tag as uthate', 'uthate.userId', 'users.id')
        .whereIn('user_location.locationId', userLocations)
        .andWhereNot('users.id', userId)
        .andWhere('users.scope', 'user')
        .andWhere(
          knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`),
        )
        .andWhere(
          knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`),
        )
        .as('test')
        .groupBy('users.id');
    }, true)
    .union(function() {
      this.select([
        ...userListFields,
        knex.raw('array_agg(DISTINCT "gender") AS genders'),
        knex.raw('array_agg(DISTINCT locations.name) AS locations'),
        knex.raw(`0 AS loveCommon`),
        knex.raw(`0 AS hateCommon `),
      ])
        .from('users')
        .leftJoin('user_gender', 'user_gender.userId', 'users.id')
        .leftJoin('genders', 'genders.id', 'user_gender.genderId')
        .leftJoin('user_location', 'user_location.userId', 'users.id')
        .leftJoin('locations', 'locations.id', 'user_location.locationId')
        .leftJoin('user_tag as utlove', 'utlove.userId', 'users.id')
        .leftJoin('user_tag as uthate', 'uthate.userId', 'users.id')
        .whereIn('user_location.locationId', userLocations)
        .whereNotIn('users.id', usersAlreadyFetched)
        .andWhereNot('users.id', userId)
        .andWhere('users.scope', 'user')
        .groupBy('users.id');
    }, true)
    .as('test_2')
    .limit(pageLimit)
    .offset(offset)
    .orderByRaw('loveCommon DESC, hateCommon DESC');
};

export const dbUserIsBanned = user => {
  return knex('banned_users')
    .where({ userId: user.id })
    .countDistinct('userId')
    .then(res => res[0].count > 0);
};

function getLocationsName(locations) {
  return knex
    .select(knex.raw('array_agg(DISTINCT locations.name) AS locations'))
    .from('locations')
    .whereIn('id', locations)
    .then(data => data[0].locations);
}

function getUserGenders(idOfUserAskedFor) {
  return knex
    .select(knex.raw('array_agg(DISTINCT "genderId") as genderArray'))
    .from('user_gender')
    .where('userId', idOfUserAskedFor)
    .then(data => data[0].genderarray);
}

function getGendersName(genders) {
  return knex
    .select(knex.raw('array_agg(DISTINCT LOWER(genders.gender)) AS genders'))
    .from('genders')
    .whereIn('id', genders)
    .then(data => data[0].genders);
}

export const dbGetUserInformation = async idOfUserAskedFor => {
  let locations = await getUserLocations(idOfUserAskedFor);
  let genders = await getUserGenders(idOfUserAskedFor);

  locations = await getLocationsName(locations);
  genders = await getGendersName(genders);

  const data = await knex
    .select(userListFields)
    .from('users')
    .where('id', idOfUserAskedFor);
  let userDetails = data[0];
  userDetails = merge(userDetails, { locations }, { genders });

  return userDetails;
};

export const dbRegisterNotificationToken = (userId, token) => {
  return knex('users')
    .update({ notificationToken: token })
    .where({ id: userId })
    .then();
};
