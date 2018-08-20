import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import {
  createEvent,
  deleteEvent,
  getEventDetails,
  getEvents,
  joinEvent,
  leaveEvent,
  updateEvent,
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
  {
    method: 'POST',
    path: '/api/events/update',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Update a specific event', 'events'),
    ),
    handler: updateEvent,
  },
  {
    method: 'PUT',
    path: '/api/events/delete/{eventId}',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Delete a specific event', 'events'),
    ),
    handler: deleteEvent,
  },
];

export default events;
