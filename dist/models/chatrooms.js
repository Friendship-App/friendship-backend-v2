'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.dbCreateChatroom = exports.dbGetChatrooms = exports.dbGetUserChatroom = undefined;

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

const dbGetUserChatroom = (exports.dbGetUserChatroom = userId =>
  _knex2.default
    .select('chatrooms.id')
    .from('chatrooms')
    .leftJoin('user_chatroom', 'chatroomId', 'chatrooms.id')
    .where('participantId', userId));

const dbGetChatrooms = (exports.dbGetChatrooms = (() => {
  var _ref = _asyncToGenerator(function*(userId) {
    let chatrooms = yield _knex2.default
      .select(
        'chatrooms.id as chatroomId',
        'chatrooms.creatorId',
        'chatrooms.isEventChatroom',
      )
      .from('chatrooms')
      .leftJoin('user_chatroom', 'user_chatroom.chatroomId', 'chatrooms.id')
      .where('user_chatroom.participantId', userId)
      .then(function(data) {
        return data;
      });

    for (let i = 0; i < chatrooms.length; i++) {
      yield _knex2.default
        .first()
        .select()
        .from('messages')
        .where('chatroomId', chatrooms[i].chatroomId)
        .orderBy('chatTime', 'desc')
        .then(function(lastMessage) {
          chatrooms[i].lastMessage = lastMessage ? lastMessage : '';
        });

      yield _knex2.default
        .count()
        .from('unread_messages')
        .where('receiverId', userId)
        .andWhere('chatroomId', chatrooms[i].chatroomId)
        .then(function(unreadMessagesCount) {
          return (chatrooms[i].unreadMessages = unreadMessagesCount[0].count);
        });

      if (!chatrooms[i].isEventChatroom) {
        yield _knex2.default
          .select('users.id', 'avatar', 'username', 'image')
          .from('user_chatroom')
          .leftJoin('users', 'user_chatroom.participantId', 'users.id')
          .where('user_chatroom.chatroomId', chatrooms[i].chatroomId)
          .then(function(participantsData) {
            return (chatrooms[i].participantsData = participantsData);
          });
      } else {
        yield _knex2.default
          .select('events.title', 'events.eventImage', 'events.id')
          .from('events')
          .where('events.chatroomId', chatrooms[i].chatroomId)
          .then(function(eventData) {
            return (chatrooms[i].eventData = eventData[0]);
          });
      }
    }

    /*for (let i = chatrooms.length - 1; i > 0; i--) {
      if (!chatrooms[i].lastMessage) {
        chatrooms.splice(i, 1);
      }
    }*/

    return chatrooms;
  });

  return function dbGetChatrooms(_x) {
    return _ref.apply(this, arguments);
  };
})());

const dbCreateChatroom = (exports.dbCreateChatroom = (() => {
  var _ref2 = _asyncToGenerator(function*(chatroomInfo) {
    console.log(chatroomInfo.creatorId);
    const chatroom = yield _knex2.default
      .insert({ creatorId: chatroomInfo.creatorId })
      .into('chatrooms')
      .returning('*')
      .then(function(createdChatrooms) {
        return createdChatrooms[0];
      });

    yield (0, _knex2.default)('user_chatroom')
      .insert([
        { chatroomId: chatroom.id, participantId: chatroomInfo.participantId },
        { chatroomId: chatroom.id, participantId: chatroomInfo.creatorId },
      ])
      .returning('*')
      .then();

    return chatroom;
  });

  return function dbCreateChatroom(_x2) {
    return _ref2.apply(this, arguments);
  };
})());
//# sourceMappingURL=chatrooms.js.map
