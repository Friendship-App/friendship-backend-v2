const logOptions = {
  reporters: {
    myConsoleReporter: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', request: '*', response: '*' }],
      },
      {
        module: 'white-out',
        args: [
          {
            password: 'remove',
          },
        ],
      },
      {
        module: 'good-console',
      },
      'stdout',
    ],
  },
};

export default logOptions;
