import { merge } from 'lodash';
import { getAuthWithScope } from '../../utils/auth';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import { getTotalFeedbacks } from '../../handlers/admin/feedback';

const feedbacks = [
  {
    method: 'GET',
    path: '/api/admin/getTotalFeedbacks',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Get all the the feedbacks', 'feedback'),
    ),
    handler: getTotalFeedbacks,
  },
];

export default feedbacks;
