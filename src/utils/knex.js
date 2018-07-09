import knex from 'knex';
import { dbConnectionConfig } from './config';

export default knex(dbConnectionConfig);
