import Joi from 'joi';
import Boom from 'boom';
import knex from '../utils/knex';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbUserIsBanned } from '../models/users';
import auth from './config/auth';

export const comparePasswords = (passwordAttempt, user) =>
  new Promise((resolve, reject) =>
    bcrypt.compare(passwordAttempt, user.password, (err, isValid) => {
      if (!err && isValid) {
        resolve(user);
      } else {
        reject(`Incorrect password attempt by user with email '${user.email}'`);
      }
    }),
  );

export const preVerifyCredentials = (
  { payload: { email, password: passwordAttempt } },
  reply,
) =>
  knex('users')
    .first()
    .where({ email: email.toLowerCase().trim() })
    .leftJoin('secrets', 'users.id', 'secrets.ownerId')
    .then(async user => {
      if (!user) {
        return Promise.reject(
          `User with email '${email}' not found in database`,
        );
      }

      if (await dbUserIsBanned(user)) {
        return Promise.reject(`'${email}' has been banned`);
      }

      if (!user.password) {
        return Promise.reject(
          `User with email '${email}' lacks password: logins disabled`,
        );
      }

      return comparePasswords(passwordAttempt, user);
    })
    .then(response => reply.response(response))
    .catch(err => {
      console.log(err);
      if (err.valueOf().includes('activated')) {
        return Boom.unauthorized(err);
      }
      return Boom.unauthorized(err);
    });

export const doAuth = {
  validate: {
    payload: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
    failAction: (request, reply) =>
      Boom.unauthorized('Incorrect email or password!'),
  },
  pre: [{ method: preVerifyCredentials, assign: 'user' }],
};

export const createToken = fields => ({
  token: jwt.sign(fields, auth.secret, {
    algorithm: auth.options.algorithms[0],
  }),
});
