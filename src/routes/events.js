import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { createEvent, getEventDetails, getEvents } from '../handlers/events';

const events = [
  {
    method: 'GET',
    path: '/api/events',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Get all the events for a user', 'events'),
    ),
    handler: getEvents,
  },
  {
    method: 'POST',
    path: '/api/events',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Create an event', 'events'),
    ),
    handler: createEvent,
  },
  {
    method: 'GET',
    path: '/api/events/{eventId}',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Get details on a specific event', 'events'),
    ),
    handler: getEventDetails,
  },
];

export default events;
