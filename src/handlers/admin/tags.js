import { dbAddTag, dbDeleteTag, dbGetTags } from '../../models/admin/tags';

export const getTags = (request, reply) => {
  return dbGetTags().then(tags => reply.response(tags));
};

export const deleteTag = (request, reply) => {
  return dbDeleteTag(request.params.tagId).then(resp => reply.response(resp));
};

export const addTag = (request, reply) => {
  return dbAddTag(request.payload, request.pre.user.id).then(tag =>
    reply.response(tag),
  );
};
