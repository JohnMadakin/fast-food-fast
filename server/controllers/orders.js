import data from '../models/data';
import config from '../config/config';

export default class Orders {
  constructor() {
    this.postOrder = this.postOrder.bind(this);
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
    const id = parseInt(req.params.id);
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

   saveOrder(order){
    return data.ordersData.push(order);
  }

  validatNumber(number){
    let valid = /^[0-9]+$/;
    return number.match(valid);
  }

  validateText (text){
    let validText = /^[0-9a-zA-Z]+$/;
    return text.match(validText);
  }
  /**
   * A method to post an order
   * @params {object} req
   * @params {object} res
   */

  postOrder(req,res) {
    const {userId,title,description,price,ingredient,calorie,payment,status,imageUrl } = req.body;
    if (!title.trim() || !description.trim() || !price.trim() || !payment.trim || !calorie.trim() || !status.trim() || !ingredient.trim() || !imageUrl.trim() || !userId.trim()) {
      return res.status(400).json({
        error: 'All the fields are required, Check correct values are inputed',
      });
    }
    if (!this.validatNumber(price) || !this.validatNumber(calorie) || !this.validatNumber(userId)) {
      return res.status(400).json({
        error: 'Invalid price, calorie or userId field',
      });
    }
    if (!this.validateText(title) || !this.validateText(payment) || !this.validateText(status)) {
      return res.status(400).json({
        error: 'Invalid title, payment or status field',
      });
    }
    const id = data.ordersData.length * 1 + 1;
    const ing = ingredient.split(' ');
    const order = {
      id,
      userId,
      title,
      description,
      ingredient: ing,
      calorie,
      price,
      payment,
      status,
      imageUrl: `${config.origin}/${imageUrl}`,
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
}
