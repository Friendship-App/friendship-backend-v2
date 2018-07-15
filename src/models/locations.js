import knex from '../utils/knex';

export const dbGetLocations = () =>
  knex
    .select()
    .from('locations')
    .orderBy('name');

export const dbRegisterLocations = userLocations =>
  knex.insert(userLocations).into('user_location');
