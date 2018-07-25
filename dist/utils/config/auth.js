'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = {
  secret: process.env.SECRET || 'really_secret_key',
  saltRounds: 10,
  options: {
    algorithms: ['HS256'],
    expiresIn: '24h',
  },
};
//# sourceMappingURL=auth.js.map
