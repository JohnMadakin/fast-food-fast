import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config/config';
import Orders from './controllers/orders';
import {
  validateUser,
  validateLoginDetail,
} from './middleware/userValidation';
import {
  validateMenuRoute,
  validateOrders,
} from './middleware/validateRoutes';
import Authenticate from './middleware/authenticate';
import Users from './controllers/users';
import db from './db/dbconnection';

const auth = new Authenticate();
const orders = new Orders();
const users = new Users();

db.tables.create();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  const info = `
    <pre>

        Welcome to the fast food fast Lite API
        The following endpoints are available:

        GET /api/v1/orders
        GET /api/v1/orders:id
        POST /api/v1/orders:id
        PATCH /api/v1/orders:id
       
    </pre>`;
  res.send(info);
});


/**
 * POST route to signup
 * @params {string} url
 * @params {function} postOrder
 */
app.post('/api/v1/auth/signup', validateUser, users.userSignUp);

/**
 * POST route to signin
 * @params {string} url
 * @params {function} postOrder
 */
app.post('/api/v1/auth/login', validateLoginDetail, users.userSignIn);

/**
 * POST route for admin signup
 * @params {string} url
 * @params {function} postOrder
 */
app.post('/api/v1/auth/admin', validateUser, users.adminSignUp);

/**
 * POST route to post menu to the DB
 * @params {string} url
 * @params {function} getAllOrders
 */
app.post('/api/v1/menu', auth.authenticateAdmin, validateMenuRoute, orders.postMenu);

/**
 * GET route to get menu
 * @params {string} url
 * @params {function} getOrder
 */
app.get('/api/v1/menu', orders.getAllMenu);

/**
 * GET route to get all oders from the DB
 * @params {string} url
 * @params {function} getAllOrders
 */
app.get('/api/v1/orders', auth.authenticateAdmin, orders.getAllOrders);

/**
 * GET route to get an order based on the orderId
 * @params {string} url
 * @params {function} getOrder
 */
app.get('/api/v1/orders/:id', auth.authenticateAdmin, orders.getOrder);

/**
 * POST route to post an order to the DB
 * @params {string} url
 * @params {function} postOrder
 */
app.post('/api/v1/orders', auth.authenticateUser, validateOrders, orders.postOrder);

/**
 * PUT route to update an order to the DB
 * @params {string} url
 * @params {function} updateOrder
 */
app.patch('/api/v1/orders/:id', orders.updateOrder);

app.listen(config.port, () => {
  console.log('fast-food-fast Server is listening on port %s, Ctrl+C to stop', config.port);
});

export default app;