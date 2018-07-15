import {
  dbGetPersonalities,
  dbRegisterPersonalities,
} from '../models/personalities';

export const getPersonalities = (request, reply) =>
  dbGetPersonalities().then(data => reply.response(data));

export const registerPersonalities = (userId, personalities) => {
  const userPersonalities = [];
  personalities.map(personality =>
    userPersonalities.push({ userId, personalityId: personality, level: 5 }),
  );
  return dbRegisterPersonalities(userPersonalities);
};
