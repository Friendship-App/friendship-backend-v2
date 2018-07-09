import { logOptions } from './index';

export const hapiManifest = {
  server: {
    // Only affects verbosity of logging to console
    // debug: process.env.NODE_ENV === 'test' ? false : { request: ['error'] },
    port: 3888,
    host: '0.0.0.0',
    debug: process.env.NODE_ENV === 'test' ? false : { request: ['error'] },
  },
  register: {
    plugins: [
      { plugin: 'hapi-auth-jwt2' },
      { plugin: 'good', options: logOptions },
    ],
    options: {},
  },
};

export const hapiOptions = {
  relativeTo: __dirname,
};
