'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.registerGenders = undefined;

var _genders = require('../models/genders');

const registerGenders = (exports.registerGenders = (userId, genders) => {
  const userGenders = [];
  genders.map(gender => userGenders.push({ userId, genderId: gender }));
  return (0, _genders.dbRegisterGenders)(userGenders);
});
//# sourceMappingURL=genders.js.map
