import { getEndpointDescription } from '../utils/endpointDescriptionGenerator';
import { merge } from 'lodash';
import { getLocations } from '../handlers/locations';

const locations = [
  {
    method: 'GET',
    path: '/api/locations',
    config: merge(
      {},
      getEndpointDescription('Get all the locations', 'locations'),
    ),
    handler: getLocations,
  },
];

export default locations;
