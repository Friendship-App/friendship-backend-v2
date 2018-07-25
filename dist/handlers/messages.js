'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.createMessage = exports.getMessages = exports.updateMessages = undefined;

var _messages = require('../models/messages');

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

const updateMessages = (exports.updateMessages = (request, reply) =>
  (0, _messages.dbUpdateMessages)(
    request.query.chatroomId,
    request.pre.user.id,
  ).then(reply.response()));

const getMessages = (exports.getMessages = (request, reply) =>
  (0, _messages.dbGetMessages)(request.query.chatroomId).then(data =>
    reply.response(data),
  ));

const createMessage = (exports.createMessage = (() => {
  var _ref = _asyncToGenerator(function*(request, reply) {
    return (0, _messages.dbCreateMessage)({
      chatTime: new Date(),
      senderId: request.pre.user.id,
      textMessage: request.payload.textMessage,
      chatroomId: request.payload.chatroomId,
    })
      .then(
        (() => {
          var _ref2 = _asyncToGenerator(function*(message) {
            const newUnreadMessages = [];
            request.payload.receiverId.map(function(id) {
              newUnreadMessages.push({
                messageId: message.id,
                receiverId: id,
                chatroomId: message.chatroomId,
              });
            });
            yield (0, _messages.dbRegisterNewUnreadMessage)(newUnreadMessages);
            return message;
          });

          return function(_x3) {
            return _ref2.apply(this, arguments);
          };
        })(),
      )
      .then(function(chatroomId) {
        return reply.response(chatroomId);
      });
  });

  return function createMessage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());
//# sourceMappingURL=messages.js.map
