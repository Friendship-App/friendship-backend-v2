import db from './db';
import dotenv from 'dotenv';

const env = process.env;

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  dotenv.config({ silent: true });
}

const requiredEnvironmentVariables = ['DATABASE_URL', 'SECRET'];

if (
  env.NODE_ENV &&
  (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test')
) {
  requiredEnvironmentVariables.forEach(key => {
    if (!env[key]) {
      /* eslint-disable no-console */
      console.log(`Warning: Environment variable ${key} not set.`);
      /* eslint-enable no-console */

      throw new Error('Quitting.');
    }
  });
}

const migrations = {
  ...db,
  development: {
    ...db,
    seeds: {
      directory: 'seeds-dev',
    },
  },
  production: {
    ...db,
    seeds: 'seeds-props',
  },
};

export default migrations;
