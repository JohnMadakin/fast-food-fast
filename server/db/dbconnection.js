import Promise from 'bluebird';
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import CreateTables from './create';

dotenv.config();

const initOptions = {
  promiseLib: Promise,
  extend(obj, dc) {
    obj.tables = new CreateTables(obj);
  },
};

const pgp = pgPromise(initOptions);

const connect = {
  host: 'localhost',
  port: 5432,
  database: 'fast_food_fast',
  user: 'postgres',
  password: 'password!1',
};

const db = pgp(process.env.DATABASE_URL || connect);


export default db;

