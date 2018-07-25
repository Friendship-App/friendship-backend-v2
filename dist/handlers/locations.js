'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.registerLocations = exports.getLocations = undefined;

var _locations = require('../models/locations');

const getLocations = (exports.getLocations = (request, reply) =>
  (0, _locations.dbGetLocations)().then(data => reply.response(data)));

const registerLocations = (exports.registerLocations = (userId, locations) => {
  const userLocations = [];
  locations.map(location =>
    userLocations.push({ userId, locationId: location }),
  );
  return (0, _locations.dbRegisterLocations)(userLocations);
});
//# sourceMappingURL=locations.js.map
