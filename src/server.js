const Glue = require('glue');
const routes = require('./routes');

// Always use UTC timezone
process.env.TZ = 'UTC';

// Glue is a hapi.js server wrapper
const manifest = {
  server: {
    // Only affects verbosity of logging to console
    // debug: process.env.NODE_ENV === 'test' ? false : { request: ['error'] },
    port: 3000,
    host: '0.0.0.0',
    debug: false
  },
  register: {
    plugins: [],
    options: {}
  },
};

const options = {
  relativeTo: __dirname,
};

const startServer = async function () {
  try {
    const server = await Glue.compose(manifest, options);
    await server.route(routes);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();