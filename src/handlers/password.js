import { dbRegisterPassword } from '../models/password';

export const registerPassword = (userId, hashPassword) =>
  dbRegisterPassword({ ownerId: userId, password: hashPassword });
