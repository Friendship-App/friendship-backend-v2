import { merge } from 'lodash';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import { authenticateAdmin } from '../../handlers/admin/login';
import { doAuthAdmin } from '../../utils/auth';

const login = [
  {
    method: 'POST',
    path: '/api/admin/login',
    config: merge(
      {},
      doAuthAdmin,
      getEndpointDescription('Authenticate an admin user', 'login'),
    ),
    handler: authenticateAdmin,
  },
];

export default login;
