import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config/config';
import Orders from './controllers/orders';

const orders = new Orders();

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

/**
 * GET route to get all oders from the DB
 * @params {string} url
 * @params {function} getAllOrders
 */
app.get('/api/v1/orders', orders.getAllOrders);

/**
 * GET route to get an order based on the orderId
 * @params {string} url
 * @params {function} getOrder
 */
app.get('/api/v1/orders/:id', orders.getOrder);

/**
 * POST route to post an order to the DB
 * @params {string} url
 * @params {function} postOrder
 */
app.post('/api/v1/orders', orders.postOrder);

/**
 * PUT route to update an order to the DB
 * @params {string} url
 * @params {function} updateOrder
 */
app.put('/api/v1/orders/:id', orders.updateOrder);

app.listen(config.port, () => {
  console.log('fast-food-fast Server is listening on port %s, Ctrl+C to stop', config.port);
});

export default app;
