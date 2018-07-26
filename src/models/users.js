import knex from '../utils/knex';
import { merge } from 'lodash';
import { getUserHate, getUserLove } from './tags';
import { hashPassword } from '../handlers/register';

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

export const dbGetUsersBatch = async (
  pageNumber,
  userId,
  usersAlreadyFetched = [],
) => {
  const pageLimit = 10;

  const loveTags = await getUserLove(userId);
  const hateTags = await getUserHate(userId);
  const userLocations = await getUserLocations(userId);

  const usersAlreadyFetchedId = [userId];
  usersAlreadyFetched.map(user => {
    usersAlreadyFetchedId.push(user.id);
  });

  let usersWithCommonTags = await knex('users')
    .select([
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
    .whereNotIn('users.id', usersAlreadyFetchedId)
    .andWhere('users.scope', 'user')
    .andWhere(
      knex.raw(`utlove."tagId" IN (${loveTags}) AND utlove."love" = true`),
    )
    .andWhere(
      knex.raw(`uthate."tagId" IN (${hateTags}) AND uthate."love" = false`),
    )
    .groupBy('users.id')
    .orderByRaw('loveCommon DESC, hateCommon DESC');

  usersWithCommonTags = usersWithCommonTags.slice(pageNumber, pageLimit);

  if (usersWithCommonTags.length < pageLimit) {
    usersWithCommonTags.map(user => usersAlreadyFetchedId.push(user.id));
    let usersWithNoCommonTags = await knex
      .select([
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
      .whereNotIn('users.id', usersAlreadyFetchedId)
      .andWhereNot('users.id', userId)
      .andWhere('users.scope', 'user')
      .groupBy('users.id');

    const limit = pageLimit - usersWithCommonTags.length;
    usersWithNoCommonTags = usersWithNoCommonTags.slice(0, limit);
    usersWithCommonTags = usersWithCommonTags.concat(usersWithNoCommonTags);
  }

  return usersWithCommonTags;
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

export const dbUpdateProfile = (newUserData, userId) => {
  const {
    avatar,
    username,
    description,
    birthyear,
    image,
    locations,
    genders,
  } = newUserData;
  const locationsArray = [];
  const gendersArray = [];
  locations.map(location =>
    locationsArray.push({ locationId: location, userId }),
  );
  genders.map(gender => gendersArray.push({ genderId: gender, userId }));

  return knex.transaction(async trx => {
    const user = await trx('users')
      .update({ avatar, username, description, birthyear, image })
      .where({ id: userId });
    await trx('user_location')
      .del()
      .where({ userId })
      .then(() =>
        trx('user_location')
          .insert(locationsArray)
          .then(),
      );
    await trx('user_gender')
      .del()
      .where({ userId })
      .then(() =>
        trx('user_gender')
          .insert(gendersArray)
          .then(),
      );

    return user;
  });
};

export const dbUpdateAccount = (newUserAccountData, userId) => {
  return knex.transaction(async trx => {
    const user = await trx('users')
      .update({ email: newUserAccountData.email })
      .where({ id: userId });
    if (newUserAccountData.password.length > 0) {
      const hashedPassword = await hashPassword(newUserAccountData.password);
      await trx('secrets')
        .update({ password: hashedPassword })
        .where({ ownerId: userId });
    }
    return user;
  });
};
