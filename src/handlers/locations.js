import { dbGetLocations, dbRegisterLocations } from '../models/locations';

export const getLocations = (request, reply) =>
  dbGetLocations().then(data => reply.response(data));

export const registerLocations = (userId, locations) => {
  const userLocations = [];
  locations.map(location =>
    userLocations.push({ userId, locationId: location }),
  );
  return dbRegisterLocations(userLocations);
};
