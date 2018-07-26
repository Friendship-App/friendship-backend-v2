import bcrypt from 'bcryptjs';
import {
  dbCheckEmailAvailability,
  dbCheckUsernameAvailability,
  dbCreateUser,
} from '../models/register';
import authConfig from '../utils/config/auth';
import { registerPassword } from './password';
import { registerLocations } from './locations';
import { registerGenders } from './genders';
import { registerTags } from './tags';
import { registerPersonalities } from './personalities';

export const checkInputAvailability = (request, reply) => {
  const { username, email } = request.query;
  if (username) {
    return dbCheckUsernameAvailability(username).then(data =>
      reply.response(data[0].count),
    );
  }
  return dbCheckEmailAvailability(email).then(data =>
    reply.response(data[0].count),
  );
};

export const registerUser = async (request, reply) => {
  const {
    password,
    scope,
    email,
    description,
    username,
    image,
    birthyear,
    mood,
    genders,
    locations,
    personalities,
    lovedTags,
    hatedTags,
  } = request.payload;
  const hashedPassword = await hashPassword(password);
  const fieldsToCreateUser = {
    email,
    description,
    username,
    birthyear,
    mood,
    image,
    scope,
  };
  return await dbCreateUser(fieldsToCreateUser)
    .then(async userId => {
      await registerPassword(userId, hashedPassword);
      await registerLocations(userId, locations);
      await registerGenders(userId, genders);
      await registerPersonalities(userId, personalities);
      await registerTags(userId, lovedTags, hatedTags);
    })
    .then(() => reply.response());
};

// Return promise which resolves to hash of given password
export const hashPassword = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(authConfig.saltRounds, (saltErr, salt) => {
      if (saltErr) {
        reject(saltErr);
      }
      bcrypt.hash(password, salt, (hashErr, hash) => {
        if (hashErr) {
          reject(hashErr);
        } else {
          resolve(hash);
        }
      });
    });
  });
