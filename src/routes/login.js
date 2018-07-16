import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { authenticateUser } from '../handlers/login';
import { doAuth } from '../utils/auth';

const login = [
  {
    method: 'POST',
    path: '/api/login',
    config: merge(
      {},
      doAuth,
      getEndpointDescription('Authenticate a user', 'login'),
    ),
    handler: authenticateUser,
  },
];

export default login;
