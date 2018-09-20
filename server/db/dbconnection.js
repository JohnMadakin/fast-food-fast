import Promise from 'bluebird';
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

const initOptions = {
  promiseLib: Promise,
};

const pgp = pgPromise(initOptions);
dotenv.config();

const db = pgp(process.env.LOCALDB || process.env.DATABASE_URL);

export default db;

