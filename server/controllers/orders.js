import db from '../db/dbconnection';


export default class Orders {
  constructor() {
    this.postOrder = this.postOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.getAllMenu = this.getAllMenu.bind(this);
  }

   /**
 * A method for Post menu
 * @params {object} req
 * @params {object} res
 */
  postMenu(req, res) {
    const { name, price, calorie,ingredients, description, imageUrl } = req.body;
    const userId = parseInt(req.user.id, 0);
    const validName = name.trim();
    db.one('INSERT INTO menu(userid,title, price,calorie,description, imageurl, ingredient) values($1,$2,$3,$4,$5,$6,$7) RETURNING id, title, price,calorie,imageurl, ingredient, description', [userId, validName, price, calorie, description, imageUrl, ingredients])
      .then((result) => {
        return res.status(201).json({
          menu: result,
          status: 'Success',
          message: 'you have successfully added a menu',
        });
      }, (err) => {
        return res.status(400).json({
          status: 'error',
          message: 'Menu not saved',
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message: 'Error adding menu',
        });
      });
  }

  /**
 * A method for users to get history of their orders
 * @params {object} req
 * @params {object} res
 */
  userOrders (req, res) {
    const id = parseInt(req.params.id, 0);
    db.task((t) => {
      return t.any('SELECT * FROM orders WHERE userid = $1', id)
        .then((result) => {
          return t.batch(result.map(resu => t.any('SELECT orderitems.ordersid, orderitems.quantity, menu.title, menu.price, menu.imageurl FROM menu INNER JOIN orderitems ON menu.id = orderitems.menuid WHERE ordersid = $1', resu.id)))
            .then((mydata) => {
              return res.status(200).json({
                ordersInfo: result,
                ordersItem: mydata,
                status: 'Success',
              });

            })
        })
    })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: 'error getting orders',
          error,
        });
      });
  }

   /**
 * A method to get all oders from the DB
 * @params {object} req
 * @params {object} res
 */

  getAllOrders(req, res) {
    const query = `SELECT orders.id, orders.userid, orders.paymentmethod, orders.orderstatus, orders.deliveryaddress, orders.total, orders.date_created, users.firstname, users.phoneno, users.imageurl, users.email FROM USERS INNER JOIN ORDERS ON users.id = orders.userid`;
    db.task((t) => {
      return t.any(query)
        .then((result) => {
          return t.batch(result.map(resu => t.any('SELECT orderitems.ordersid, orderitems.quantity, menu.title, menu.price, menu.imageurl FROM menu INNER JOIN orderitems ON menu.id = orderitems.menuid WHERE ordersid = $1', resu.id)))
            .then((mydata) => {
              return res.status(200).json({
                ordersInfo: result,
                ordersItem: mydata,
                status: 'Success',
              });

            })
        })
    })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: 'error getting orders',
          error,
        });
      });
  }


 /**
 * A method to get order by id
 * @params {object} req
 * @params {object} res
 */
  getOrder(req, res) {
    const id = parseInt(req.params.id, 0);
    if (!id) {
      return res.status(400).json({
        error: 'Invalid order Id',
      });
    }
    db.any(`SELECT orders.id, orders.userid, orders.paymentmethod, orders.orderstatus, orders.deliveryaddress, orders.total, orders.date_created, users.firstname, users.phoneno, users.imageurl, users.email, orderitems.menuid, orderitems.quantity FROM USERS INNER JOIN ORDERS ON users.id = orders.userid INNER JOIN ORDERITEMS ON orders.id = orderitems.ordersid WHERE orders.id = $1`, id)
      .then((item) => {
        if(item.length < 1) {
          return res.status(404).json({
            item,
            status: 'error',
            message: 'order not found',
          });
        }
        return res.status(200).json({
          item,
          status: 'Success',
          message: 'Get order Successfull',
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: 'error getting orders',
          error,
        });
      });
  }

   /**
   * A method to get all available menu
   * @params {object} req
   * @params {object} res
   */
  getAllMenu(req, res) {
    db.any('SELECT title as name, price, calorie, description, ingredient, imageurl,id FROM menu')
      .then((result) => {
        return res.status(200).json({
          menu: result,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: 'error getting orders',
          error,
        });
      });
  }

 /**
   * A method to calculate the total amount of  an order
   * @params {object} req
   * @params {object} res
   */
  calculateTotal(orders) {
    const init = 0;
    const total = orders.reduce((acc, curr) => {
      return (acc + (curr.price * curr.quantity));
    }, init);
    return total;
  }


 /**
  * A method to post an order
  * @params {object} req
  * @params {object} res
  */
  postOrder(req, res) {
    const {
      orders,
      payment,
      status,
      deliveryAddress,
    } = req.body;
    const userId = req.user.id;
    let total = 0;
    let userOrderId = 0;
    db.task((t) => {
      return t.batch(orders.map(order => t.one('SELECT id, price from MENU WHERE id = $1', order.itemid)))
        .then((result) => {
          orders.forEach((order, i) => {
            order.price = result[i].price;
          });
          total = this.calculateTotal(orders);
          return t.one('INSERT INTO orders (userid, paymentmethod,orderstatus,deliveryaddress,total) values ($1,$2,$3,$4,$5) returning id', [userId, payment, status, deliveryAddress, total])
            .then((mydata) => {
              userOrderId = mydata.id;
              return t.batch(orders.map(order => t.none('INSERT INTO ORDERITEMS(ordersid, menuid, quantity) VALUES($1,$2,$3)', [mydata.id, order.itemid, order.quantity])))
            });
        });
    })
      .then(() => {
        return res.status(201).json({
          orders: {
            ordersid: userOrderId,
            items: orders,
          },
          total,
          status: 'Success',
          message: 'you have successfully placed your orders',
        });
      })
      .catch((error) => {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid menuId, check that your itemsId is valid',
          error,
        });
      });
  }

  /**
   * A method to Update status an order
   * @params {object} req
   * @params {object} res
   */
  updateOrder(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    db.one('UPDATE orders SET orderStatus = $1 WHERE id = $2 RETURNING id', [status, id])
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            status: 'error',
            message: 'order not found',
          });
        }
        return res.status(200).json({
          status: 'success',
          message: 'order updated',
        });
      })
      .catch((e) => {
        return res.status(500).json({
          status: 'error',
          message: 'could not update',
          e,
        });
      })
  }

 /**
 * search for menu
 * @param {object} req
 * @param {object} res
 */
  search(req, res) {
    let { query } = req.query;
    if(!query || query.length > 25) return res.status(400).json(query);
    query = `%${query}%`
    db.any('SELECT id, title as name, imageurl,price,calorie,ingredient, description FROM menu WHERE title ILIKE $1', [query])
      .then((data) => {
        if (data.length > 0) {
          return res.status(200).json({
            status: 'success',
            data,
          });
        }
        return res.status(404).json({
          message: 'No Search Results Found',
        });

      })
      .catch((err) => {
        return res.status(500).json({
          query,
          message: 'server search error',
        });
      });
  }


}
