'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.routes = undefined;

var _lodash = require('lodash');

var _endpointDescriptionGenerator = require('../utils/endpointDescriptionGenerator');

var _aws = require('../handlers/aws');

const aws = [
  /*
* Respond to GET requests to /sign-s3.
* Upon request, return JSON containing the temporarily-signed S3 request and
* the anticipated URL of the image.
*/
  {
    method: 'GET',
    path: '/api/sign-s3',
    config: (0, _lodash.merge)(
      {},
      (0, _endpointDescriptionGenerator.getEndpointDescription)(
        'Create a unique link to upload to AWS S3 bucket',
        'aws',
      ),
    ),
    handler: _aws.getSignedUrl,
  },
];
exports.default = aws;
const routes = (exports.routes = server => server.route(aws));
//# sourceMappingURL=aws.js.map
