const dbConnectionConfig = {
  debug: false,
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'friendship',
    ssl: false,
  },
  pool: {
    min: 1,
    max: 1,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
};

export default dbConnectionConfig;
