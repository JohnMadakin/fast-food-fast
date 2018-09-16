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

  validateNumber(number) {
    if (typeof number === 'number') return true;
    return false;
  }

  validateText (text) {
    const validText = /^[0-9a-zA-Z]+$/;
    return text.match(validText);
  }
  /**
   * A method to post an order
   * @params {object} req
   * @params {object} res
   */

  postOrder(req,res) {
    const {userId,title,description,price,ingredient,calorie,payment,status,imageUrl } = req.body;
    if (!title.trim() || !description.trim() || !status.trim() || !imageUrl.trim()) {
      return res.status(400).json({
        error: 'All the fields are required, Check correct values are inputed',
      });
    }
    if (!this.validateNumber(price) || !this.validateNumber(calorie) || !this.validateNumber(userId)) {
      return res.status(400).json({
        error: 'Invalid price, calorie or userId field',
      });
    }
    if (!this.validateText(title) || !this.validateText(payment) || !this.validateText(status)) {
      return res.status(400).json({
        error: 'Invalid title, payment or status field',
      });
    }
    if (!Array.isArray(ingredient)) {
      return res.status(400).json({ error: 'Invalid ingredient format. Should be an Array', });
    }
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
      imageUrl: `${config.origin}/server/public/${imageUrl}`,
    };
    this.saveOrder(order);
    if (data.ordersData.length === id) {
      return res.status(201).json({
        order,
      });
    }
    return res.status(500).json({
      error: 'Error Saving your order',
    });
  }

  updateOrder(req, res) {
    const { status } = req.body;
    const { id } = req.params;
    const validNum = /^[0-9]+$/;
    const validStatus = ['accepted', 'pending', 'rejected', 'confirmed'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        error: 'Invalid data entry!',
      });
    }
    if (!id.match(validNum)) {
      return res.status(400).json({
        error: 'Invalid ID!',
      });
    }
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
