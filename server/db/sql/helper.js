import QueryFile from 'pg-promise';
import path from 'path';

const Query = QueryFile.QueryFile;

const sql = (file) => {
  const fullPath = path.join(__dirname, file);
  const options = {
    minify: true,
  };
  const qf = new Query(fullPath, options);

  if (qf.error) {
    console.error(qf.error);
  }
  return qf;
};

export default {
  tables: {
    create: sql('query/query.sql'),
  },
};
