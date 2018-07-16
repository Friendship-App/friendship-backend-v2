import { createToken } from '../utils/auth';

export const authenticateUser = (request, reply) =>
  reply.response(
    createToken({
      id: request.pre.user.id,
      email: request.pre.user.email,
      scope: request.pre.user.scope,
    }),
  );
