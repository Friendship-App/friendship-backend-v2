'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbRegisterNotificationToken = exports.dbGetUserInformation = exports.dbUserIsBanned = exports.dbGetUsersBatch = undefined;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

var _lodash = require('lodash');

var _tags = require('./tags');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            },
          );
        }
      }
      return step('next');
    });
  };
}

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
  return (0, _knex2.default)('user_location')
    .leftJoin('locations', 'locations.id', 'user_location.locationId')
    .where('userId', userId)
    .select(
      _knex2.default.raw('array_agg(DISTINCT locations.id) as locationsArray'),
    )
    .then(res => {
      return res[0].locationsarray;
    });
}

const dbGetUsersBatch = (exports.dbGetUsersBatch = (() => {
  var _ref = _asyncToGenerator(function*(pageNumber, userId) {
    const pageLimit = 10;
    const offset = pageNumber * pageLimit;

    const loveTags = yield (0, _tags.getUserLove)(userId);
    const hateTags = yield (0, _tags.getUserHate)(userId);

    const userLocations = yield getUserLocations(userId);

    const usersAlreadyFetched = yield (0, _knex2.default)('users')
      .select(_knex2.default.raw('array_agg(DISTINCT users.id) as arr'))
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
        _knex2.default.raw(
          `utlove."tagId" IN (${loveTags}) AND utlove."love" = true`,
        ),
      )
      .andWhere(
        _knex2.default.raw(
          `uthate."tagId" IN (${hateTags}) AND uthate."love" = false`,
        ),
      )
      .limit(offset)
      .then(function(res) {
        return res.length > 0 ? res[0].arr : [];
      });

    return _knex2.default
      .from(function() {
        this.select([
          ...userListFields,
          _knex2.default.raw('array_agg(DISTINCT "gender") AS genders'),
          _knex2.default.raw('array_agg(DISTINCT locations.name) AS locations'),
          _knex2.default.raw('count(DISTINCT utlove."tagId") AS loveCommon'),
          _knex2.default.raw('count(DISTINCT uthate."tagId") AS hateCommon'),
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
            _knex2.default.raw(
              `utlove."tagId" IN (${loveTags}) AND utlove."love" = true`,
            ),
          )
          .andWhere(
            _knex2.default.raw(
              `uthate."tagId" IN (${hateTags}) AND uthate."love" = false`,
            ),
          )
          .as('test')
          .groupBy('users.id');
      }, true)
      .union(function() {
        this.select([
          ...userListFields,
          _knex2.default.raw('array_agg(DISTINCT "gender") AS genders'),
          _knex2.default.raw('array_agg(DISTINCT locations.name) AS locations'),
          _knex2.default.raw(`0 AS loveCommon`),
          _knex2.default.raw(`0 AS hateCommon `),
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
  });

  return function dbGetUsersBatch(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

const dbUserIsBanned = (exports.dbUserIsBanned = user => {
  return (0, _knex2.default)('banned_users')
    .where({ userId: user.id })
    .countDistinct('userId')
    .then(res => res[0].count > 0);
});

function getLocationsName(locations) {
  return _knex2.default
    .select(
      _knex2.default.raw('array_agg(DISTINCT locations.name) AS locations'),
    )
    .from('locations')
    .whereIn('id', locations)
    .then(data => data[0].locations);
}

function getUserGenders(idOfUserAskedFor) {
  return _knex2.default
    .select(_knex2.default.raw('array_agg(DISTINCT "genderId") as genderArray'))
    .from('user_gender')
    .where('userId', idOfUserAskedFor)
    .then(data => data[0].genderarray);
}

function getGendersName(genders) {
  return _knex2.default
    .select(
      _knex2.default.raw(
        'array_agg(DISTINCT LOWER(genders.gender)) AS genders',
      ),
    )
    .from('genders')
    .whereIn('id', genders)
    .then(data => data[0].genders);
}

const dbGetUserInformation = (exports.dbGetUserInformation = (() => {
  var _ref2 = _asyncToGenerator(function*(idOfUserAskedFor) {
    let locations = yield getUserLocations(idOfUserAskedFor);
    let genders = yield getUserGenders(idOfUserAskedFor);

    locations = yield getLocationsName(locations);
    genders = yield getGendersName(genders);

    const data = yield _knex2.default
      .select(userListFields)
      .from('users')
      .where('id', idOfUserAskedFor);
    let userDetails = data[0];
    userDetails = (0, _lodash.merge)(userDetails, { locations }, { genders });

    return userDetails;
  });

  return function dbGetUserInformation(_x3) {
    return _ref2.apply(this, arguments);
  };
})());

const dbRegisterNotificationToken = (exports.dbRegisterNotificationToken = (
  userId,
  token,
) => {
  return (0, _knex2.default)('users')
    .update({ notificationToken: token })
    .where({ id: userId })
    .then();
});
//# sourceMappingURL=users.js.map
