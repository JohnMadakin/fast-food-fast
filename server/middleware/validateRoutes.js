import ValidateUser from './userValidation';

const validate = new ValidateUser();

export default class Validator {
  constructor() {
    this.validateOrders = this.validateOrders.bind(this);
    this.validateID = this.validateID.bind(this);
    this.validatePrice = this.validatePrice.bind(this);
    this.validateCalorie = this.validateCalorie.bind(this);
    this.validateMenuRoute = this.validateMenuRoute.bind(this);
  }

  validateKeys(validKeys, keys, res) {
    if (validKeys.length !== keys.length) {
      return res.status(400).json({
        status: "Failure",
        message: "Incomplete or key length exceeded"
      });
    }
    for (let key of keys) {
      if (!validKeys.includes(key)) {
        return res.status(400).json({
          error: `${key} is an Invalid key`,
        });
      }
    }
    return true;
  }

 validateUserID(id, res) {
    if (!validate.validateID(id)){
      return res.status(400).json({
        status: "Failure",
        message: `Invalid value for userID`,
      });
    }
    return true;
  }

  validateStatus(status, validStatus, res) {
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Invalid data entry for status',
      });
    } 
    return true;
  }

  validatePayment(payment, req, res, key) {
    if (payment !== 'payondelivery') {
      return res.status(400).json({
        status: 'Failure',
        message: `Invalid data entry! payment values can't be ${req.body[key]}`,
      });
    }
    return true;
  }

  validateAddress(deliveryAddress, res) {
    if (!validate.validateText(deliveryAddress)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Invalid data entry! Check your Delivery Address field',
      });
    }
    return true;
  }

  validateItemName(name,res) {
    if(validate.validateString(name)){
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid Item Name, check your orders items',
      });
    }
    return true;
  }

  validateOrdersItems(orders, res) {
    for (let order of orders){
      this.validateItemName(order.itemName);
      if(typeof orders.price !== 'number' || !this.validateNumber(order.price) ){
        return res.status(400).json({
          status: 'failure',
          message: `Invalid price value, check your orders items`,
        });
      }
      if(typeof orders.quantity !== 'number' || !this.validateNumber(order.quantity) ){
        return res.status(400).json({
          status: 'failure',
          message: `Invalid Quantity value, check your orders items`,
        });
      }
    }
    return true;
  }

  validatePrice(key, price, res) {
    if (key === 'price' && !this.validateNumber(price)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid price entry!',
      });
    }
    return true;
  }

  validateCalorie(key, calorie, res) {
    if (key === 'calorie' && !this.validateNumber(calorie)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid Calorie entry!',
      });
    }
    return true;
  }
  validateMenu(key, value, res) {
    if (key === 'menu' && !menuValues.includes(value)) {
      const menuValues = ['burgers','chicken', 'breakfast-packs', 'lunch-packs'];
      return res.status(400).json({
        status: 'failure',
        message: `Invalid menu entry!`,
      });
    }
    return true;
  }

  validateImage(key,image, res) {
    if (key === 'imageUrl' && !validate.validateImageUrl(image)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid image URL',
      });
    }
    return true;
  }

  validateDescription(key, des, res) {
    if (key === 'description' && !validate.validateText(des)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid image URL',
      });
    }
    return true;
  }

  validateIngredients(key, ingredients, res) {
    const validText = /^[0-9a-zA-Z ,]+$/;
    if (key === 'ingredients' && !validText.test(ingredients)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid ingredient format! please separate items with a comma',
      });
    }
    return true;
  }

  validateMenuRoute(req, res, next) {
    const { name, price, calorie, menu, ingredients, description, imageUrl } = req.body;
    const validKeys = ['name', 'price', 'calorie', 'menu', 'ingredients', 'description', 'imageUrl'];
    const inputs = Object.keys(req.body);
    this.validateKeys(validKeys, inputs, res);
    for (let key of inputs) {
      this.validatePrice(key,price,res);
      this.validateMenu(key, menu,res);
      this.validateCalorie(key,calorie,res);
      if (key === 'name'){
        this.validateItemName(name,res);
      }
      this.validateDescription(key, description,res);
      this.validateImage(key,imageUrl,res);
      this.validateIngredients(key,ingredients,res);
    }
  }
    
  validateOrders(req, res, next) {
    const { userId, orders, status, payment, deliveryAddress } = req.body;
    const validKeys = ['userId', 'orders', 'status', 'payment', 'deliveryAddress'];
    const validStatus = ['pending', 'confirmed', 'accepted', 'declined'];
    const inputs = Object.keys(res.body);
    this.validateKeys(validKeys, inputs, res);
    for (let key in inputs ) {
      if (key === 'userId'){
        this.validateUserID(userId,req,res)
      }
      if (key === 'status') {
        this.validateStatus(status,validStatus,res);
      }
      if (key === 'payment') {
        this.validatePayment(payment,req,res,key);
      }
      if (key === 'deliveryAddress') {
        this.validateAddress(deliveryAddress, req, res);
      }
      if (key === 'orders' && !Array.isArray(req.body[key])) {
        return res.status(400).json({
          status: "Failure",
          message: `Invalid data entry! orders should be of type array`,
        });
      }
    }
    this.validateOrdersItems(orders, res);
    return next();
  }

  validateNumber(num) {
    const reg = /^[0-9]+$/;
    if (reg.test(num)) {
      return true;
    }
    return false;
  }

  validateID(req, res, next) {
    const { id } = req.body;
    if (typeof id !== 'number' || !this.validateNumber(id)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Invalid Parameter Id',
      });
    }
    return next();
  }
}
