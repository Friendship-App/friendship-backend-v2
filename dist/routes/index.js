'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _locations = require('./locations');

var _locations2 = _interopRequireDefault(_locations);

var _avatars = require('./avatars');

var _avatars2 = _interopRequireDefault(_avatars);

var _personalities = require('./personalities');

var _personalities2 = _interopRequireDefault(_personalities);

var _tags = require('./tags');

var _tags2 = _interopRequireDefault(_tags);

var _register = require('./register');

var _register2 = _interopRequireDefault(_register);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _chatrooms = require('./chatrooms');

var _chatrooms2 = _interopRequireDefault(_chatrooms);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _aws = require('./aws');

var _aws2 = _interopRequireDefault(_aws);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const routes = [].concat(
  _avatars2.default,
  _locations2.default,
  _login2.default,
  _messages2.default,
  _personalities2.default,
  _register2.default,
  _tags2.default,
  _users2.default,
  _chatrooms2.default,
  _events2.default,
  _aws2.default,
);

exports.default = routes;
//# sourceMappingURL=index.js.map
