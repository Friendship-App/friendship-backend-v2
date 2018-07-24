import knex from 'knex';
import dbConnectionConfig from './config/db';

export default knex(dbConnectionConfig);
