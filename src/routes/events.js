import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import {
  createEvent,
  getEventDetails,
  getEvents,
  joinEvent,
  leaveEvent,
} from '../handlers/events';

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
  {
    method: 'POST',
    path: '/api/events/join/{eventId}',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Join a specific event', 'events'),
    ),
    handler: joinEvent,
  },
  {
    method: 'POST',
    path: '/api/events/leave/{eventId}',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Leave a specific event', 'events'),
    ),
    handler: leaveEvent,
  },
];

export default events;
