'use strict';

var _glue = require('glue');

var _glue2 = _interopRequireDefault(_glue);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _hapi = require('./utils/config/hapi');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

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

// Always use UTC timezone
process.env.TZ = 'UTC';

const startServer = (() => {
  var _ref = _asyncToGenerator(function*() {
    try {
      const server = yield _glue2.default.compose(
        _hapi.hapiManifest,
        _hapi.hapiOptions,
      );

      server.auth.strategy('jwt', 'jwt', {
        key: 'really_secret_key',
        validate: function(decoded, request) {
          const invalidToken = !decoded.id || !decoded.email || !decoded.scope;

          if (invalidToken) {
            return {
              isValid: false,
              response: new Error(
                'JWT is missing some fields and not valid! Please log out and in again.',
              ),
            };
          } else {
            return { isValid: true };
          }
        },
        verifyOptions: { algorithms: ['HS256'], expiresIn: '24h' },
      });

      server.events.on('route', function(route) {
        console.log(`New route added: ${route.path}`);
      });

      const io = _socket2.default.listen(server.listener);
      io.on('connect', function(socket) {
        console.log('A client just joined on', socket.id);
        socket.on('message', message => {
          console.log('= = = = = = = = = = = = = = == = = ');
          console.log('sending...');
          console.log(message);
          console.log('= = = = = = = = = = = = = = == = = ');
          // socket.emit('message', message);
          socket.broadcast.emit('message', message);
        });
      });
      // io.sockets.on('message', function(socket) {
      //   console.log(socket);
      // });

      yield server.route(_routes2.default);
      yield server.start();
      console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

  return function startServer() {
    return _ref.apply(this, arguments);
  };
})();

startServer();
//# sourceMappingURL=server.js.map
