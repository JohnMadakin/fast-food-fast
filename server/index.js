import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config/config';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  const info = `
    <pre>

        Welcome to the fast food fast Lite API
        The following endpoints are available:

       
    </pre>`;
  res.send(info);
});

app.listen(config.port, () => {
  console.log('fast-food-fast Server is listening on port %s, Ctrl+C to stop', config.port);
});

export default app;
