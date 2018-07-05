const Hapi = require('hapi');
const pg = require('pg');

const pool = new pg.Pool({
  connectionString: 'postgres://postgres:password@localhost:5432/friendship_v2',
});

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const init = async () => {
  pool.connect((err, client, done) => {
    console.log('connected');
    done();
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();