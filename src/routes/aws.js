import { merge } from 'lodash';
import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { getSignedUrl } from '../handlers/aws';

const aws = [
  /*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
  {
    method: 'GET',
    path: '/api/sign-s3',
    config: merge(
      {},
      getEndpointDescription(
        'Create a unique link to upload to AWS S3 bucket',
        'aws',
      ),
    ),
    handler: getSignedUrl,
  },
];
export default aws;

export const routes = server => server.route(aws);
