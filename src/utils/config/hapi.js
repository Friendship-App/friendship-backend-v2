import logOptions from './log';
import metrics from '../../plugins/metrics';

export const hapiManifest = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    debug: process.env.NODE_ENV === 'test' ? false : { request: ['error'] },
    routes: { cors: true },
  },
  register: {
    plugins: [
      { plugin: 'hapi-auth-jwt2' },
      { plugin: 'good', options: logOptions },
      { plugin: 'vision' },
      { plugin: 'inert' },
      {
        plugin: 'hapi-swagger',
        options: {
          pathPrefixSize: 2,
          basePath: '/api',
          info: {
            title: 'Friendship API Documentation',
            version: 'v1.0',
          },
        },
      },
      {
        plugin: metrics,
      },
    ],
  },
};

export const hapiOptions = {
  relativeTo: __dirname,
};
