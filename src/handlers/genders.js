import { dbRegisterGenders } from '../models/genders';

export const registerGenders = (userId, genders) => {
  const userGenders = [];
  genders.map(gender => userGenders.push({ userId, genderId: gender }));
  return dbRegisterGenders(userGenders);
};
