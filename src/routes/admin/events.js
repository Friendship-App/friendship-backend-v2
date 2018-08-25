import { merge } from 'lodash';
import { getAuthWithScope } from '../../utils/auth';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import { deleteEvent, getEvents } from '../../handlers/admin/events';

const events = [
  {
    method: 'GET',
    path: '/api/admin/events',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Get all the events for the admin', 'events'),
    ),
    handler: getEvents,
  },
  {
    method: 'POST',
    path: '/api/admin/events/delete/{eventId}',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Delete a specific event', 'events'),
    ),
    handler: deleteEvent,
  },
];

export default events;
