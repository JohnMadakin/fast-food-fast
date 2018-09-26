import data from '../models/data';
import db from '../db/dbconnection';


export default class Orders {
  constructor() {
    this.postOrder = this.postOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.getMenu = this.getMenu.bind(this);
  }

  postMenu(req, res) {
    const { name, price, calorie,ingredients, description, imageUrl } = req.body;
    const userId = parseInt(req.user.id, 0);
    const validName = name.trim();
    db.one('INSERT INTO MENU(userid,title, price,calorie,description, imageurl, ingredient) values($1,$2,$3,$4,$5,$6,$7) RETURNING id, title, price,calorie,imageurl, ingredient, description', [userId, validName, price, calorie, description, imageUrl, ingredients])
      .then((result) => {
        return res.status(201).json({
          menu: result,
          status: 'Success',
          message: 'you have successfully added a menu',
        });
      }, (err) => {
        if (err.code == '23505') {
          return res.status(400).json({
            status: 'error',
            message: 'Menu name already exist',
          });
        }
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
 * A method to get all oders from the DB
 * @params {object} req
 * @params {object} res
 */
  getAllOrders(req, res) {
    const allOrders = [...data.ordersData];
    if (allOrders.length >= 0) {
      return res.status(200).json(
        {
          data: allOrders,
        },
      );
    }
    return res.status(500).json({
      error: 'Error fetching Data from the data structure'
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
    const allOrders = [...data.ordersData];
    const foundOrder = allOrders.filter(order => order.id === id);
    if (foundOrder.length === 1) {
      return res.status(200).json({
        order: foundOrder[0],
      });
    }
    if (foundOrder.length === 0) {
      return res.status(404).json({
        error: 'order not found',
      });
    }
    return res.status(500).json({
      error: 'Error fetching Data from the data structure'
    });
  }

  /**
   * A method to get all available menu
   * @params {object} req
   * @params {object} res
   */
  getAllMenu(req, res) {
    db.any('SELECT title as name, price, calorie, description, ingredient, imageurl FROM MENU')
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
    const total = this.calculateTotal(orders);
    db.one('INSERT INTO ORDERS (userid, paymentmethod,orderstatus,deliveryaddress,total) values ($1,$2,$3,$4,$5) returning id', [userId, payment, status, deliveryAddress, total])
      .then((itemorderid) => {
        for (let i = 0; i < orders.length; i++) {
          const { itemName, quantity } = orders[i];
          db.one('SELECT id FROM MENU where title = $1', itemName)
            .then((menuid) => {
              db.none('INSERT INTO ORDERITEMS(ordersid,menuid, quantity) VALUES($1,$2,$3)', [itemorderid.id, menuid.id, quantity])
            },(e)=>{
              return res.status(404).json({
                message: `${itemName} not found`,
              });
            });
        }
      })
      .then((data) => {
        return res.status(200).json({
          status: 'Success',
          message: 'you have successfully placed your orders',
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: 'order not placed',
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
    const orderIndex = data.ordersData.findIndex(order => order.id === parseInt(id, 0));
    if (orderIndex !== -1) {
      return res.status(200).json({
        message: 'Resource Updated Successfully!',
      });
    }
    return res.status(404).json({
      error: 'Resource Not found!',
    });
  }
}
