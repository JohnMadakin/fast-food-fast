import {
  validateKeys,
  validateKeysLength,
  validateString,
  validateImageUrl,
  validateText,
} from './userValidation';

const validateNumber = (number) => {
  const validator = `${number}`;
  if (validator.length > 6 || typeof number !== 'number') {
    return false;
  }
  return true;
};

const validateIngredients = (ingredients) => {
  const validText = /^[0-9a-zA-Z ,]+$/;
  if (!validText.test(ingredients)) {
    return false;
  }
  return true;
};

const validateFoodName = (string) => {
  if (typeof string !== 'string') return false;
  if (string.length < 2 || string.length > 25) return false;
  const validString = /^[a-zA-Z  -]+$/;
  return string.trim().match(validString);
}

export const validateMenuRoute = (req, res, next) => {
  const {
    name,
    price,
    calorie,
    menu,
    ingredients,
    description,
    imageUrl,
  } = req.body;
  const validKeys = ['name', 'price', 'calorie', 'menu', 'ingredients', 'description', 'imageUrl'];
  const validMenu = ['chicken', 'burgers', 'noddles', 'breverages'];
  const inputs = Object.keys(req.body);
  if (inputs.length > validKeys.length) {
    return res.status(400).json({
      error: 'invalid key',
      message: 'number of keys exceeded',
    });
  }
  if (inputs.length < validKeys.length) {
    return res.status(400).json({
      error: 'invalid key',
      message: 'incomplete valid keys',
    });
  }
  for (let i = 0; i < inputs.length; i++) {
    if (validateKeys(inputs[i], validKeys) === false) {
      return res.status(400).json({
        status: 'invalid key',
        message: 'please enter valid keys',
      });
    }
  }
  if (!validateFoodName(name)) {
    return res.status(400).json({
      status: 'invalid data entry',
      message: 'food name has an invalid value',
    });
  }
  if (!validateNumber(price) || !validateNumber(calorie)) {
    return res.status(400).json({
      status: 'valid data entry',
      message: 'price or calorie has an invalid value',
    });
  }
  if (validateKeys(menu.toLowerCase(), validMenu) === false) {
    return res.status(400).json({
      status: 'invalid data entry',
      message: 'please enter a valid value for menu',
    });
  }
  if (!validateIngredients(ingredients)) {
    return res.status(400).json({
      status: 'invalid data entry',
      message: 'Invalid ingredient format! please separate items with a comma',
    });
  }
  if (!validateText(description)) {
    return res.status(400).json({
      status: 'invalid data entry',
      message: 'decription has an invalid value',
    });
  }
  if (!validateImageUrl(imageUrl)) {
    return res.status(400).json({
      status: 'invalid data entry',
      message: 'imageurl has an invalid value',
    });
  }
  return next();
};


const validateStatus = (status, validStatus, res)  => {
  if (!validStatus.includes(status)) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Invalid data entry for status',
    });
  } 
  return true;
}

const validatePayment = (payment, req, res, key) => {
  if (payment !== 'payondelivery') {
    return res.status(400).json({
      status: 'Failure',
      message: `Invalid data entry! payment values can't be ${req.body[key]}`,
    });
  }
  return true;
}

const validateAddress = (deliveryAddress, res) => {
  if (!validateText(deliveryAddress)) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Invalid data entry! Check your Delivery Address field',
    });
  }
  return true;
}

const validateItemName = (name,res) => {
  if (validateString(name)) {
    return res.status(400).json({
      status: 'failure',
      message: 'Invalid Item Name, check your orders items',
    });
  }
  return true;
}

export const validateOrdersItems = (orders, res) => {
  for (let order of orders){
    validateItemName(order.itemName);
    if(typeof orders.price !== 'number' || !validateNumber(order.price) ){
      return res.status(400).json({
        status: 'failure',
        message: `Invalid price value, check your orders items`,
      });
    }
    if(typeof orders.quantity !== 'number' || !validateNumber(order.quantity) ){
      return res.status(400).json({
        status: 'failure',
        message: `Invalid Quantity value, check your orders items`,
      });
    }
  }
  return true;
}



   
const validateOrders = (req, res, next) => {
  const { userId, orders, status, payment, deliveryAddress } = req.body;
  const validKeys = ['userId', 'orders', 'status', 'payment', 'deliveryAddress'];
  const validStatus = ['pending', 'confirmed', 'accepted', 'declined'];
  const inputs = Object.keys(res.body);
  validateKeys(validKeys, inputs, res);
  for (let key in inputs ) {
    if (key === 'userId'){
      validateUserID(userId,req,res)
    }
    if (key === 'status') {
      validateStatus(status,validStatus,res);
    }
    if (key === 'payment') {
      validatePayment(payment,req,res,key);
    }
    if (key === 'deliveryAddress') {
      validateAddress(deliveryAddress, req, res);
    }
    if (key === 'orders' && !Array.isArray(req.body[key])) {
      return res.status(400).json({
        status: "Failure",
        message: `Invalid data entry! orders should be of type array`,
      });
    }
  }
  validateOrdersItems(orders, res);
  return next();
}
