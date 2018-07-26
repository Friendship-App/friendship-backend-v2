import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getMoods } from '../handlers/moods';

const avatars = [
  {
    method: 'GET',
    path: '/api/moods',
    config: merge({}, getEndpointDescription('Get all the moods', 'moods')),
    handler: getMoods,
  },
];

export default avatars;
