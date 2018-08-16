import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import {
  getPersonalities,
  getUserPersonalities,
  updateUserPersonalities,
} from '../handlers/personalities';
import { getAuthWithScope } from '../utils/auth';

const personalities = [
  {
    method: 'GET',
    path: '/api/personalities',
    config: merge(
      { cors: true },
      getEndpointDescription('Get all the personalities', 'personalities'),
    ),
    handler: getPersonalities,
  },
  {
    method: 'GET',
    path: '/api/userPersonalities',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription(
        'Get the personalities for a specific user by id',
        'personalities',
      ),
    ),
    handler: getUserPersonalities,
  },
  {
    method: 'POST',
    path: '/api/userPersonalities/update',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription(
        'Update the personalities for a specific user',
        'personalities',
      ),
    ),
    handler: updateUserPersonalities,
  },
];

export default personalities;
