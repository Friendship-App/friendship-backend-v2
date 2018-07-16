import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getAvatars } from '../handlers/avatars';

const avatars = [
  {
    method: 'GET',
    path: '/api/avatars',
    config: merge({}, getEndpointDescription('Get all the avatars', 'avatars')),
    handler: getAvatars,
  },
];

export default avatars;
