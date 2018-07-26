#!/usr/bin/env node

import Glue from 'glue';
import routes from './routes';
import { hapiManifest, hapiOptions } from './utils/config/hapi';
import SocketIO from 'socket.io';

// Always use UTC timezone
process.env.TZ = 'UTC';

const startServer = async function() {
  try {
    const server = await Glue.compose(
      hapiManifest,
      hapiOptions,
    );

    server.auth.strategy('jwt', 'jwt', {
      key: process.env.SECRET || 'really_secret_key',
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

    const io = SocketIO.listen(server.listener);
    io.on('connect', function(socket) {
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
