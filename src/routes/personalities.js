import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/EndpointDescriptionGenerator';
import { getPersonalities } from '../handlers/personalities';

const personalities = [
  {
    method: 'GET',
    path: '/api/personalities',
    config: merge(
      {},
      getEndpointDescription('Get all the personalities', 'personalities'),
    ),
    handler: getPersonalities,
  },
];

export default personalities;
