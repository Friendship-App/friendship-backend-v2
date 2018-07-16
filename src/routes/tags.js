import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getActivities, getInterests, getUserTags } from '../handlers/tags';
import { getAuthWithScope } from '../utils/auth';

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
  {
    method: 'GET',
    path: '/api/tags',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Get the tags for a specific user by id', 'tags'),
    ),
    handler: getUserTags,
  },
];

export default tags;
