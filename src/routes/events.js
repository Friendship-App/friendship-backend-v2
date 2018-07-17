import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getEvents } from '../handlers/events';

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
];

export default events;
