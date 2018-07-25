import dotenv from 'dotenv';
import dbConnectionConfig from './db';

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

const config = {
  db: { ...dbConnectionConfig },
};

export default {
  ...config,
  db: {
    // Developer's local machine
    development: {
      ...config.db,

      seeds: {
        directory: 'seeds-dev',
      },
    },

    // Production environment
    production: {
      ...config.db,

      seeds: {
        directory: 'seeds-prod',
      },
    },
  },
};
