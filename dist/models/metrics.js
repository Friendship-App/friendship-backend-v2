'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbDisplayMonthMetrics = exports.dbDisplayWeekMetrics = exports.dbDisplayAllMetrics = exports.dbUpdateAverageConversationsLength = exports.dbDisplayAverageConversationsLength = exports.dbUpDateActiveConversationsData = exports.dbDisplayActiveConversationData = exports.dbUpdateActiveUsersData = exports.dbDisplayActiveUsersData = exports.dbUpdateRegisteredUsersData = exports.dbDisplayRegisteredUsersData = exports.getDates = exports.dbGetRegisteredUser = exports.dbUserLastActive = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _knex = require('../utils/knex');

var _knex2 = _interopRequireDefault(_knex);

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

const isDebugOn = false;

const dbUserLastActive = (exports.dbUserLastActive = userId =>
  (0, _knex2.default)('users')
    .where({ id: userId })
    .update({ lastActive: (0, _moment2.default)() }));

// minh - created data model for each registered user row
const dbGetRegisteredUser = (exports.dbGetRegisteredUser = id =>
  (0, _knex2.default)('metrics_users_registered')
    .first()
    .where({ id }));

// minh - display emtrics data on front-end with some logic
// 1. collect data from users table
// 2. create an array of dates from desired startDate to now
// 3. collect data from metrics table
// 4. compare dates from metrics table with the array
// 5. update counts/average on date array where matched
// 6. check if metrics table is empty
// 7. insert updated data from date array if empty, otherwise do nothing
// 8. return latest 30 rows on metrics table to front-end.

// method to create array of dates between start and end
const getDates = (exports.getDates = (startDate, endDate) => {
  const dates = [];
  const chosenDate = (0, _moment2.default)(startDate).startOf('day');
  while (chosenDate.isSameOrBefore((0, _moment2.default)(endDate))) {
    dates.push({
      timestamp: (0, _moment2.default)(chosenDate),
      count: 0,
    });
    chosenDate.add(1, 'days');
  }
  return dates;
});

// count registered users by date
const dbDisplayRegisteredUsersData = (exports.dbDisplayRegisteredUsersData = (() => {
  var _ref = _asyncToGenerator(function*() {
    // generate date arrays
    const comparingData = yield getDates(
      '2018-01-01',
      (0, _moment2.default)().startOf('day'),
    );
    // empty array to hold data to be inserted, updated
    const data = [];

    // collect data from users table
    const collectUsersCreatedAt = yield (0, _knex2.default)('users')
      .debug(isDebugOn)
      .select(
        _knex2.default.raw(
          'count(\'*\') as users_count, Date(users."createdAt") as timestamp',
        ),
      )
      .groupBy('timestamp')
      .orderBy('timestamp', 'asc');

    // compare to date array
    yield comparingData.forEach(
      (() => {
        var _ref2 = _asyncToGenerator(function*(element) {
          yield collectUsersCreatedAt.forEach(function(row) {
            if (
              (0, _moment2.default)(element.timestamp).isSame(
                (0, _moment2.default)(row.timestamp),
              )
            ) {
              // update the count on matched dates
              element.count = row.users_count;
            }
            return element.count;
          });
          // populate data array
          data.push(element);
        });

        return function(_x) {
          return _ref2.apply(this, arguments);
        };
      })(),
    );

    // check metrics table to do the inserts
    const collectMetricsUsersRegistered = yield (0, _knex2.default)(
      'metrics_users_registered',
    )
      .debug(isDebugOn)
      .select('*');

    if (collectMetricsUsersRegistered.length === 0) {
      yield data.forEach(
        (() => {
          var _ref3 = _asyncToGenerator(function*(element) {
            yield _knex2.default.transaction(function(trx) {
              return trx('metrics_users_registered')
                .debug(isDebugOn)
                .insert({
                  users_count: element.count,
                  timestamp: element.timestamp,
                })
                .returning('*')
                .then(function(results) {
                  return results[0];
                });
            });
          });

          return function(_x2) {
            return _ref3.apply(this, arguments);
          };
        })(),
      );
    }
    return (0, _knex2.default)('metrics_users_registered')
      .debug(isDebugOn)
      .select('*')
      .orderBy('timestamp', 'desc');
  });

  return function dbDisplayRegisteredUsersData() {
    return _ref.apply(this, arguments);
  };
})());

// minh - logic to insert new row or update the row
const dbUpdateRegisteredUsersData = (exports.dbUpdateRegisteredUsersData = (() => {
  var _ref4 = _asyncToGenerator(function*() {
    const existingData = yield dbDisplayRegisteredUsersData();

    const dayRegisteredUsers = yield (0, _knex2.default)('users')
      .debug(isDebugOn)
      .count('*')
      .where(
        _knex2.default.raw('??::date = ?', [
          'createdAt',
          (0, _moment2.default)().startOf('day'),
        ]),
      );

    // check if there is a row with today's date in the table
    // if yes update the row, if no insert a new row

    if (
      (0, _moment2.default)(existingData[0].timestamp)
        .startOf('day')
        .isSame((0, _moment2.default)().startOf('day'))
    ) {
      yield _knex2.default.transaction(function(trx) {
        return trx('metrics_users_registered')
          .debug(isDebugOn)
          .update({ users_count: dayRegisteredUsers[0].count })
          .where(
            _knex2.default.raw('??::date = ?', [
              'timestamp',
              (0, _moment2.default)().startOf('day'),
            ]),
          );
      });
    } else {
      yield _knex2.default.transaction(function(trx) {
        return trx('metrics_users_registered')
          .debug(isDebugOn)
          .insert({
            users_count: dayRegisteredUsers[0].count,
            timestamp: (0, _moment2.default)().startOf('day'),
          });
      });
    }
    return (0, _knex2.default)('metrics_users_registered')
      .debug(isDebugOn)
      .select('*')
      .where(
        _knex2.default.raw('??::date = ?', [
          'timestamp',
          (0, _moment2.default)().startOf('day'),
        ]),
      );
  });

  return function dbUpdateRegisteredUsersData() {
    return _ref4.apply(this, arguments);
  };
})());

// minh - display last active users count on front-end
const dbDisplayActiveUsersData = (exports.dbDisplayActiveUsersData = (() => {
  var _ref5 = _asyncToGenerator(function*() {
    const comparingData = yield getDates(
      '2018-01-01',
      (0, _moment2.default)().startOf('day'),
    );
    const data = [];

    const collectUsersLastActive = yield (0, _knex2.default)('users')
      .debug(isDebugOn)
      .select(
        _knex2.default.raw(
          'count(\'*\') as users_count, Date(users."lastActive") as timestamp',
        ),
      )
      .groupBy('timestamp')
      .orderBy('timestamp', 'asc');

    yield comparingData.forEach(
      (() => {
        var _ref6 = _asyncToGenerator(function*(element) {
          yield collectUsersLastActive.forEach(function(row) {
            if (
              (0, _moment2.default)(element.timestamp).isSame(
                (0, _moment2.default)(row.timestamp),
              )
            ) {
              element.count = row.users_count;
            }
            return element.count;
          });
          data.push(element);
        });

        return function(_x3) {
          return _ref6.apply(this, arguments);
        };
      })(),
    );

    const collectMetricsActiveUsers = yield (0, _knex2.default)(
      'metrics_active_users',
    )
      .debug(isDebugOn)
      .select('*');

    if (collectMetricsActiveUsers.length === 0) {
      yield data.forEach(
        (() => {
          var _ref7 = _asyncToGenerator(function*(element) {
            yield _knex2.default.transaction(function(trx) {
              return trx('metrics_active_users')
                .debug(isDebugOn)
                .insert({
                  users_count: element.count,
                  timestamp: element.timestamp,
                })
                .returning('*')
                .then(function(results) {
                  return results[0];
                });
            });
          });

          return function(_x4) {
            return _ref7.apply(this, arguments);
          };
        })(),
      );
    }
    return (0, _knex2.default)('metrics_active_users')
      .debug(isDebugOn)
      .select('*')
      .orderBy('timestamp', 'desc');
  });

  return function dbDisplayActiveUsersData() {
    return _ref5.apply(this, arguments);
  };
})());

// count lastActive from users table
// insert or update the result into a row on metrics_active_users.users_count
const dbUpdateActiveUsersData = (exports.dbUpdateActiveUsersData = (() => {
  var _ref8 = _asyncToGenerator(function*() {
    const existingData = yield dbDisplayActiveUsersData();

    const dayActiveUsers = yield (0, _knex2.default)('users')
      .debug(isDebugOn)
      .count('*')
      .where(
        _knex2.default.raw('??::date = ?', [
          'lastActive',
          (0, _moment2.default)().startOf('day'),
        ]),
      );

    // check if there is a row with today's date in the table
    // if yes update the row, if no insert a new row
    if (
      (0, _moment2.default)(existingData[0].timestamp)
        .startOf('day')
        .isSame((0, _moment2.default)().startOf('day'))
    ) {
      yield _knex2.default.transaction(function(trx) {
        return trx('metrics_active_users')
          .debug(isDebugOn)
          .update({ users_count: dayActiveUsers[0].count })
          .where(
            _knex2.default.raw('??::date = ?', [
              'timestamp',
              (0, _moment2.default)().startOf('day'),
            ]),
          );
      });
    } else {
      yield _knex2.default.transaction(function(trx) {
        return trx('metrics_active_users')
          .debug(isDebugOn)
          .insert({
            users_count: dayActiveUsers[0].count,
            timestamp: (0, _moment2.default)().startOf('day'),
          });
      });
    }
    return (0, _knex2.default)('metrics_active_users')
      .debug(isDebugOn)
      .select('*')
      .where(
        _knex2.default.raw('??::date = ?', [
          'timestamp',
          (0, _moment2.default)().startOf('day'),
        ]),
      );
  });

  return function dbUpdateActiveUsersData() {
    return _ref8.apply(this, arguments);
  };
})());

// minh - display active conversation counts by date
const dbDisplayActiveConversationData = (exports.dbDisplayActiveConversationData = (() => {
  var _ref9 = _asyncToGenerator(function*() {
    const comparingData = yield getDates(
      '2018-01-01',
      (0, _moment2.default)().startOf('day'),
    );
    const data = [];

    const collectLastMessagesByDate = yield (0, _knex2.default)('messages')
      .debug(isDebugOn)
      .select(
        _knex2.default.raw(
          'Date(messages."chat_time") as timestamp, count(distinct messages."chatroom_id") as conversations_count',
        ),
      )
      .groupBy('timestamp')
      .orderBy('timestamp', 'asc');

    yield comparingData.forEach(
      (() => {
        var _ref10 = _asyncToGenerator(function*(element) {
          yield collectLastMessagesByDate.forEach(function(row) {
            if (
              (0, _moment2.default)(element.timestamp).isSame(
                (0, _moment2.default)(row.timestamp),
              )
            ) {
              element.count = row.conversations_count;
            }
            return element.count;
          });
          data.push(element);
        });

        return function(_x5) {
          return _ref10.apply(this, arguments);
        };
      })(),
    );

    const collectMetricsActiveConversations = yield (0, _knex2.default)(
      'metrics_active_conversations',
    )
      .debug(isDebugOn)
      .select('*');

    if (collectMetricsActiveConversations.length === 0) {
      yield data.forEach(
        (() => {
          var _ref11 = _asyncToGenerator(function*(element) {
            yield _knex2.default.transaction(function(trx) {
              return trx('metrics_active_conversations')
                .debug(isDebugOn)
                .insert({
                  conversations_count: element.count,
                  timestamp: element.timestamp,
                })
                .returning('*')
                .then(function(results) {
                  return results[0];
                });
            });
          });

          return function(_x6) {
            return _ref11.apply(this, arguments);
          };
        })(),
      );
    }
    return (0, _knex2.default)('metrics_active_conversations')
      .debug(isDebugOn)
      .select('*')
      .orderBy('timestamp', 'desc');
  });

  return function dbDisplayActiveConversationData() {
    return _ref9.apply(this, arguments);
  };
})());

// minh - logic to update/ insert data row in metrics_active_conversations
const dbUpDateActiveConversationsData = (exports.dbUpDateActiveConversationsData = (() => {
  var _ref12 = _asyncToGenerator(function*() {
    const existingData = yield dbDisplayActiveConversationData();

    const dayActiveConversations = yield (0, _knex2.default)('messages')
      .debug(isDebugOn)
      .countDistinct('chatroom_id')
      .where(
        _knex2.default.raw('??::date = ?', [
          'chat_time',
          (0, _moment2.default)().startOf('day'),
        ]),
      );

    if (
      (0, _moment2.default)(existingData[0].timestamp)
        .startOf('day')
        .isSame((0, _moment2.default)().startOf('day'))
    ) {
      yield _knex2.default.transaction(function(trx) {
        return trx('metrics_active_conversations')
          .debug(isDebugOn)
          .update({ conversations_count: dayActiveConversations[0].count })
          .where(
            _knex2.default.raw('??::date = ?', [
              'timestamp',
              (0, _moment2.default)().startOf('day'),
            ]),
          );
      });
    } else {
      yield _knex2.default.transaction(function(trx) {
        return trx('metrics_active_conversations')
          .debug(isDebugOn)
          .insert({
            conversations_count: dayActiveConversations[0].count,
            timestamp: (0, _moment2.default)().startOf('day'),
          });
      });
    }

    return (0, _knex2.default)('metrics_active_conversations')
      .debug(isDebugOn)
      .select('*')
      .where(
        _knex2.default.raw('??::date = ?', [
          'timestamp',
          (0, _moment2.default)().startOf('day'),
        ]),
      );
  });

  return function dbUpDateActiveConversationsData() {
    return _ref12.apply(this, arguments);
  };
})());

// minh - display average conversations length by date
const dbDisplayAverageConversationsLength = (exports.dbDisplayAverageConversationsLength = (() => {
  var _ref13 = _asyncToGenerator(function*() {
    const comparingData = yield getDates(
      '2018-01-01',
      (0, _moment2.default)().startOf('day'),
    );
    const data = [];

    yield dbDisplayActiveConversationData();

    const joinChatroomMessagesByDate = yield (0, _knex2.default)(
      'metrics_active_conversations',
    )
      .debug(isDebugOn)
      .join(
        'messages',
        _knex2.default.raw('??::date', ['timestamp']),
        _knex2.default.raw('??::date', ['messages.chat_time']),
      )
      .select(
        _knex2.default
          .raw(`metrics_active_conversations."timestamp" as timestamp, 
                      metrics_active_conversations."conversations_count" as number_of_chatrooms, 
                      count(messages."id") as number_of_messages`),
      )
      .groupBy('timestamp', 'number_of_chatrooms');

    yield comparingData.forEach(
      (() => {
        var _ref14 = _asyncToGenerator(function*(element) {
          yield joinChatroomMessagesByDate.forEach(function(row) {
            if (
              (0, _moment2.default)(element.timestamp).isSame(
                (0, _moment2.default)(row.timestamp),
              )
            ) {
              element.count = row.number_of_chatrooms;
              element.messages_count = row.number_of_messages;
            }
            return element;
          });
          data.push(element);
        });

        return function(_x7) {
          return _ref14.apply(this, arguments);
        };
      })(),
    );

    const collectMetricsConversationsLength = yield (0, _knex2.default)(
      'metrics_conversations_length',
    )
      .debug(isDebugOn)
      .select('*');

    if (collectMetricsConversationsLength.length === 0) {
      yield data.forEach(
        (() => {
          var _ref15 = _asyncToGenerator(function*(element) {
            const avgLength = element.messages_count / element.count;
            Number.isNaN(avgLength)
              ? yield _knex2.default.transaction(function(trx) {
                  return trx('metrics_conversations_length')
                    .debug(isDebugOn)
                    .insert({
                      conversations_length: 0,
                      timestamp: element.timestamp,
                    });
                })
              : yield _knex2.default.transaction(function(trx) {
                  return trx('metrics_conversations_length')
                    .debug(isDebugOn)
                    .insert({
                      conversations_length: avgLength.toFixed(2),
                      timestamp: element.timestamp,
                    });
                });
          });

          return function(_x8) {
            return _ref15.apply(this, arguments);
          };
        })(),
      );
    }
    return (0, _knex2.default)('metrics_conversations_length')
      .debug(isDebugOn)
      .select('*')
      .orderBy('timestamp', 'desc');
  });

  return function dbDisplayAverageConversationsLength() {
    return _ref13.apply(this, arguments);
  };
})());

// minh - logic to update or insert conversations length row
const dbUpdateAverageConversationsLength = (exports.dbUpdateAverageConversationsLength = (() => {
  var _ref16 = _asyncToGenerator(function*() {
    const existingData = yield dbDisplayAverageConversationsLength();
    const dayStats = yield (0, _knex2.default)('metrics_active_conversations')
      .debug(isDebugOn)
      .join(
        (0, _knex2.default)('messages')
          .select(
            _knex2.default.raw(
              `chat_time::date AS "chatDate", count(id) AS "chatCount"`,
            ),
          )
          .groupBy('chatDate')
          .orderBy('chatDate', 'asc')
          .as('t1'),
        'metrics_active_conversations.timestamp',
        'chatDate',
      )
      .select(
        _knex2.default.raw(`timestamp::date AS "Date", 
                conversations_count AS "Rooms", 
                t1."chatCount"`),
      )
      .groupBy('Date', 'Rooms', 't1.chatCount')
      .orderBy('Date', 'desc');

    const avgLength = (0, _moment2.default)(dayStats[0].Date)
      .startOf('day')
      .isSame((0, _moment2.default)().startOf('day'))
      ? dayStats[0].chatCount / dayStats[0].Rooms
      : 0;

    if (
      (0, _moment2.default)(existingData[0].timestamp)
        .startOf('day')
        .isSame((0, _moment2.default)().startOf('day'))
    ) {
      Number.isNaN(avgLength)
        ? yield _knex2.default.transaction(function(trx) {
            return trx('metrics_conversations_length')
              .debug(isDebugOn)
              .update({
                conversations_length: 0,
              })
              .where(
                _knex2.default.raw('??::date = ?', [
                  'timestamp',
                  (0, _moment2.default)().startOf('day'),
                ]),
              );
          })
        : yield _knex2.default.transaction(function(trx) {
            return trx('metrics_conversations_length')
              .debug(isDebugOn)
              .update({
                conversations_length: avgLength.toFixed(2),
              })
              .where(
                _knex2.default.raw('??::date = ?', [
                  'timestamp',
                  (0, _moment2.default)().startOf('day'),
                ]),
              );
          });
    } else {
      Number.isNaN(avgLength)
        ? yield _knex2.default.transaction(function(trx) {
            return trx('metrics_conversations_length')
              .debug(isDebugOn)
              .insert({
                conversations_length: 0,
                timestamp: (0, _moment2.default)().startOf('day'),
              });
          })
        : yield _knex2.default.transaction(function(trx) {
            return trx('metrics_conversations_length')
              .debug(isDebugOn)
              .insert({
                conversations_length: avgLength.toFixed(2),
                timestamp: (0, _moment2.default)().startOf('day'),
              });
          });
    }

    return (0, _knex2.default)('metrics_conversations_length')
      .debug(isDebugOn)
      .select('*')
      .where(
        _knex2.default.raw('??::date = ?', [
          'timestamp',
          (0, _moment2.default)().startOf('day'),
        ]),
      );
  });

  return function dbUpdateAverageConversationsLength() {
    return _ref16.apply(this, arguments);
  };
})());

// metrics by week, month, whole history
const dbDisplayAllMetrics = (exports.dbDisplayAllMetrics = () =>
  (0, _knex2.default)('metrics_users_registered')
    .join(
      'metrics_active_users',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', ['metrics_active_users.timestamp']),
    )
    .join(
      'metrics_active_conversations',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', [
        'metrics_active_conversations.timestamp',
      ]),
    )
    .join(
      'metrics_conversations_length',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', [
        'metrics_conversations_length.timestamp',
      ]),
    )
    .select(
      _knex2.default.raw(`metrics_users_registered."timestamp" as date,
                      metrics_users_registered."users_count" as number_of_users_registered,
                      metrics_active_users."users_count" as number_of_active_users,
                      metrics_active_conversations."conversations_count" as number_of_active_conversations,
                      metrics_conversations_length."conversations_length" as average_conversations_length`),
    )
    .groupBy(
      'date',
      'number_of_users_registered',
      'number_of_active_users',
      'number_of_active_conversations',
      'average_conversations_length',
    )
    .orderBy('date', 'desc'));

const dbDisplayWeekMetrics = (exports.dbDisplayWeekMetrics = () =>
  (0, _knex2.default)('metrics_users_registered')
    .join(
      'metrics_active_users',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', ['metrics_active_users.timestamp']),
    )
    .join(
      'metrics_active_conversations',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', [
        'metrics_active_conversations.timestamp',
      ]),
    )
    .join(
      'metrics_conversations_length',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', [
        'metrics_conversations_length.timestamp',
      ]),
    )
    .select(
      _knex2.default.raw(`metrics_users_registered."timestamp" as date,
                      metrics_users_registered."users_count" as number_of_users_registered,
                      metrics_active_users."users_count" as number_of_active_users,
                      metrics_active_conversations."conversations_count" as number_of_active_conversations,
                      metrics_conversations_length."conversations_length" as average_conversations_length`),
    )
    .limit(7)
    .groupBy(
      'date',
      'number_of_users_registered',
      'number_of_active_users',
      'number_of_active_conversations',
      'average_conversations_length',
    )
    .orderBy('date', 'desc'));

const dbDisplayMonthMetrics = (exports.dbDisplayMonthMetrics = () =>
  (0, _knex2.default)('metrics_users_registered')
    .join(
      'metrics_active_users',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', ['metrics_active_users.timestamp']),
    )
    .join(
      'metrics_active_conversations',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', [
        'metrics_active_conversations.timestamp',
      ]),
    )
    .join(
      'metrics_conversations_length',
      _knex2.default.raw('??::date', ['metrics_users_registered.timestamp']),
      _knex2.default.raw('??::date', [
        'metrics_conversations_length.timestamp',
      ]),
    )
    .select(
      _knex2.default.raw(`metrics_users_registered."timestamp" as date,
                      metrics_users_registered."users_count" as number_of_users_registered,
                      metrics_active_users."users_count" as number_of_active_users,
                      metrics_active_conversations."conversations_count" as number_of_active_conversations,
                      metrics_conversations_length."conversations_length" as average_conversations_length`),
    )
    .limit(30)
    .groupBy(
      'date',
      'number_of_users_registered',
      'number_of_active_users',
      'number_of_active_conversations',
      'average_conversations_length',
    )
    .orderBy('date', 'desc'));
//# sourceMappingURL=metrics.js.map
