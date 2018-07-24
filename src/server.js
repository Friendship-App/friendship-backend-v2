import Glue from 'glue';
import routes from './routes';
import { hapiManifest, hapiOptions } from './utils/config/hapi';

// Always use UTC timezone
process.env.TZ = 'UTC';

const startServer = async function() {
  try {
    const server = await Glue.compose(
      hapiManifest,
      hapiOptions,
    );
    let io = require('socket.io')(server.listener);
    server.auth.strategy('jwt', 'jwt', {
      key: 'really_secret_key',
      validate: (decoded, request) => {
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
    server.events.on('route', route => {
      console.log(`New route added: ${route.path}`);
    });
    io.on('connection', function(socket) {
      console.log('A client just joined on', socket.id);
      socket.on('message', message => {
        socket.broadcast.emit('message', message);
      });
    });
    await server.route(routes);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
