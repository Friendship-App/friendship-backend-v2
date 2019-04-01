import knex from '../utils/knex';
import { merge, orderBy } from 'lodash';
import {
  getUserHate,
  getUserLove,
  dbHasUnseenTags,
  calcCommonTagPercent,
} from './tags';
import { hashPassword } from '../handlers/register';
import moment from 'moment';

const userListFields = [
  'users.id',
  'users.createdAt',
  'users.lastActive',
  'users.email',
  'users.scope',
  'users.username',
  'users.description',
  'users.mood',
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
  const pageLimit = 10 * (pageNumber + 1);

  const userLocations = await getUserLocations(userId);
  const userTags = await getUserTags(userId);
  const userTagIds = userTags.map(({ tagId }) => tagId);
  const usersAlreadyFetchedId = [userId];

  return knex.transaction(async trx => {
    return trx
      .select([
        ...userListFields,
        knex.raw('array_agg(DISTINCT "gender") AS genders'),
        knex.raw('array_agg(DISTINCT locations.name) AS locations'),
      ])
      .from('users')
      .leftJoin('user_gender', 'user_gender.userId', 'users.id')
      .leftJoin('genders', 'genders.id', 'user_gender.genderId')
      .leftJoin('user_location', 'user_location.userId', 'users.id')
      .leftJoin('locations', 'locations.id', 'user_location.locationId')
      .whereIn('locationId', userLocations)
      .whereNotIn('users.id', usersAlreadyFetchedId)
      .groupBy('users.id')
      .then(async usersWithSameLocations => {
        for (let i = 0; i < usersWithSameLocations.length; i++) {
          const userWithSameLocationId = usersWithSameLocations[i].id;
          usersWithSameLocations[i][
            'commonTagPercent'
          ] = await getCommonTagPercent(
            trx,
            userWithSameLocationId,
            userTagIds,
            userTags,
          );
        }

        usersWithSameLocations = orderBy(
          usersWithSameLocations,
          ['commonTagPercent'],
          ['desc'],
        );
        return usersWithSameLocations.slice(0, pageLimit);
      });
  });
};

const getCommonTagPercent = async (
  trx,
  userWithSameLocationId,
  userTagIds,
  userTags,
) => {
  const commonTags = await trx('user_tag')
    .select('tagId', 'love')
    .where(trx.raw(`"tagId" IN (${userTagIds})`))
    .andWhere('userId', userWithSameLocationId);

  return calcCommonTagPercent(commonTags, userTags);
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

export const dbGetUserInformation = async (idOfUserAskedFor, isOwnProfile) => {
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

  if (isOwnProfile) {
    userDetails.hasUnseenTags = await dbHasUnseenTags(idOfUserAskedFor);
  }

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
    mood,
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
      .update({ mood, username, description, birthyear, image })
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

export const dbReportUser = (data, reporterId) => {
  return knex
    .insert({
      userId: data.userId,
      description: data.reason,
      reported_by: reporterId,
      createdAt: moment(),
    })
    .into('reports')
    .returning('*');
};

export const dbDeleteUser = userId => {
  return knex.transaction(async trx => {
    await trx
      .del()
      .from('user_tag')
      .where({ userId });
    await trx
      .del()
      .from('user_event')
      .where({ participantId: userId });
    await trx
      .del()
      .from('user_personality')
      .where({ userId });
    await trx
      .del()
      .from('secrets')
      .where({ ownerId: userId });
    await trx
      .del()
      .from('user_gender')
      .where({ userId });
    await trx
      .del()
      .from('user_location')
      .where({ userId });

    return trx
      .update({
        active: false,
        createdAt: null,
        lastActive: null,
        email: null,
        description: null,
        image: null,
        compatibility: null,
        enableMatching: null,
        birthyear: null,
        notificationToken: null,
        status: null,
        mood: null,
      })
      .from('users')
      .where({ id: userId });
  });
};
