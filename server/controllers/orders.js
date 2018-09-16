import data from '../models/data';
import config from '../config/config';

export default class Orders {
  constructor() {
    this.postOrder = this.postOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
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

  saveOrder(order) {
    return data.ordersData.push(order);
  }
  /**
   * A method to post an order
   * @params {object} req
   * @params {object} res
   */

  postOrder(req,res) {
    const {userId, title, description, price, ingredient, calorie, payment, status, imageUrl } = req.body;
    const id = data.ordersData.length * 1 + 1;
    const order = {
      id,
      userId,
      title,
      description,
      ingredient,
      calorie,
      price,
      payment,
      status,
      imageUrl: `${config.origin}/${imageUrl}`,
    };
    this.saveOrder(order);
    if (data.ordersData.length === id) {
      return res.status(200).json({
        order,
      });
    }
    return res.status(500).json({
      error: 'Error Saving your order',
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
