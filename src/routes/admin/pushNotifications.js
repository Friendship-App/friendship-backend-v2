import { merge } from 'lodash';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import { getAuthWithScope } from '../../utils/auth';
import { createPushNotification } from '../../handlers/admin/pushNotifications';

const pushNotifications = [
  {
    method: 'POST',
    path: '/api/admin/pushNotifications/send',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription(
        'Send a new push notification',
        'pushNotifications',
      ),
    ),
    handler: createPushNotification,
  },
];

export default pushNotifications;
