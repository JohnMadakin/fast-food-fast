import data from '../models/data';

export default class Orders {
  /**
 * A method to get all oders from the DB
 * @params {object} req
 * @params {object} res
 */
  getAllOrders(req, res) {
    const allOrders = [...data.ordersData];
    if (allOrders.length >= 0) {
      res.status(200).json(
        {
          data: allOrders,
        }
      );
    }
    res.status(500).json({
      error: 'Error fetching Data from the data structure'
    });
  }
}
