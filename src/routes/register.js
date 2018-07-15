import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/EndpointDescriptionGenerator';
import { checkInputAvailability, registerUser } from '../handlers/register';

const register = [
  {
    method: 'POST',
    path: `/api/register`,
    config: merge(
      {},
      getEndpointDescription('Register a new user', 'registration'),
    ),
    handler: registerUser,
  },
  {
    method: 'GET',
    path: `/api/register/validate`,
    config: merge(
      {},
      getEndpointDescription(
        'Validate that a username or an email is available',
        'registration',
      ),
    ),
    handler: checkInputAvailability,
  },
];

export default register;
