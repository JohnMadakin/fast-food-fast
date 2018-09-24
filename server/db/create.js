import sql from './sql/helper';

const sqlConstant = sql.tables;

export default class CreateTables {
  constructor(db) {
    this.db = db;
  }

  create() {
    return this.db.none(sqlConstant.create);
  }
}
