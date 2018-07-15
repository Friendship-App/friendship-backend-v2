import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/EndpointDescriptionGenerator';
import { getActivities, getInterests } from '../handlers/tags';

const tags = [
  {
    method: 'GET',
    path: '/api/tags/interests',
    config: merge({}, getEndpointDescription('Get all the interests', 'tags')),
    handler: getInterests,
  },
  {
    method: 'GET',
    path: '/api/tags/activities',
    config: merge({}, getEndpointDescription('Get all the activities', 'tags')),
    handler: getActivities,
  },
];

export default tags;
