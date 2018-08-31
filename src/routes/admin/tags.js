import { merge } from 'lodash';
import { getEndpointDescription } from '../../utils/endpointDescriptionGenerator';
import {
  addTag,
  deleteTag,
  getTags,
  updateTag,
} from '../../handlers/admin/tags';
import { getAuthWithScope } from '../../utils/auth';

const tags = [
  {
    method: 'GET',
    path: '/api/admin/tags',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Get all the tags', 'tags'),
    ),
    handler: getTags,
  },
  {
    method: 'POST',
    path: '/api/admin/tags/delete/{tagId}',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Delete a specific tag', 'tags'),
    ),
    handler: deleteTag,
  },
  {
    method: 'POST',
    path: '/api/admin/tags/add',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Add a new tag', 'tags'),
    ),
    handler: addTag,
  },
  {
    method: 'POST',
    path: '/api/admin/tags/update',
    config: merge(
      {},
      getAuthWithScope('admin'),
      getEndpointDescription('Update a tag', 'tags'),
    ),
    handler: updateTag,
  },
];

export default tags;
