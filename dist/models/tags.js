'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbRegisterTags = exports.dbGetUserTags = exports.dbGetActivities = exports.dbGetTags = undefined;
exports.getUserLove = getUserLove;
exports.getUserHate = getUserHate;

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

var _lodash = require('lodash');

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

const dbGetTags = (exports.dbGetTags = () =>
  _knex2.default.select().from('tags'));

const dbGetActivities = (exports.dbGetActivities = () =>
  _knex2.default
    .select()
    .from('tags')
    .where('category', 1));

function getUserLove(userId) {
  return (0, _knex2.default)('user_tag')
    .where('userId', userId)
    .andWhere('love', true)
    .select(_knex2.default.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });
}

function getUserHate(userId) {
  return (0, _knex2.default)('user_tag')
    .where('userId', userId)
    .andWhere('love', false)
    .select(_knex2.default.raw('array_agg(DISTINCT "tagId") as tagsArray'))
    .then(res => {
      return res[0].tagsarray;
    });
}

function getTagsDetails(tags = []) {
  return _knex2.default
    .select()
    .from('tags')
    .whereIn('id', tags);
}

const dbGetUserTags = (exports.dbGetUserTags = (() => {
  var _ref = _asyncToGenerator(function*(idOfUserAskedFor, userId) {
    let loveInCommon, hateInCommon;
    let loveTags = yield getUserLove(idOfUserAskedFor);
    let hateTags = yield getUserHate(idOfUserAskedFor);

    if (loveTags) {
      loveInCommon = yield getTagInCommon(loveTags, userId, true);
      loveTags = yield getTagsDetails(loveTags);
    } else {
      loveInCommon = 0;
      loveTags = [];
    }

    if (hateTags) {
      hateInCommon = yield getTagInCommon(hateTags, userId, false);
      hateTags = yield getTagsDetails(hateTags);
    } else {
      hateInCommon = 0;
      hateTags = [];
    }

    const userTags = (0, _lodash.merge)(
      {},
      { loveTags, hateTags, loveInCommon, hateInCommon },
    );
    return userTags;
  });

  return function dbGetUserTags(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

const dbRegisterTags = (exports.dbRegisterTags = userTags =>
  _knex2.default.insert(userTags).into('user_tag'));

function getTagInCommon(tags = [], idOfUserAskedFor, love) {
  return _knex2.default
    .count()
    .from('user_tag')
    .whereIn('tagId', tags)
    .andWhere('userId', idOfUserAskedFor)
    .andWhere('love', love)
    .then(data => data[0].count);
}
//# sourceMappingURL=tags.js.map
