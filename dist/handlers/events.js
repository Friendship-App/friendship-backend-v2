'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getEventDetails = exports.createEvent = exports.getEvents = undefined;

var _events = require('../models/events');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const getEvents = (exports.getEvents = (request, reply) =>
  (0, _events.dbGetEvents)(request.pre.user.id).then(res => {
    const events = res;
    for (let i = events.length - 1; i > -1; i--) {
      if (
        (0, _moment2.default)(
          (0, _moment2.default)(events[i].date).format(),
        ).isBefore(request.params.time) ||
        events[i].maxParticipants <= events[i].participants
      ) {
        events.splice(i, 1);
      }
    }
    return reply.response(events);
  }));

const createEvent = (exports.createEvent = (request, reply) =>
  (0, _events.dbCreateEvent)(request.payload).then(event =>
    reply.response(event),
  ));

const getEventDetails = (exports.getEventDetails = (request, reply) =>
  (0, _events.dbGetEventDetails)(
    request.params.eventId,
    request.pre.user.id,
  ).then(data => reply.response(data)));
//# sourceMappingURL=events.js.map
