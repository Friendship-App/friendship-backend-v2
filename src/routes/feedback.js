import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { insertAppFeedback } from '../handlers/feedback';

const feedback = [
  {
    method: 'POST',
    path: '/api/feedback',
    config: merge(
      {},
      getAuthWithScope('user'),
      getEndpointDescription('Insert a new feedback', 'feedback'),
    ),
    handler: insertAppFeedback,
  },
];

export default feedback;
