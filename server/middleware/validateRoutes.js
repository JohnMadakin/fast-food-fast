import {
  validateKeys,
  validateString,
  validateImageUrl,
  validateText,
} from './userValidation';

const validateNumber = (number) => {
  const validNum = /^[0-9]+$/;
  if (!validNum.test(number)) {
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
};

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


export const validateOrders = (req, res, next) => {
  const { orders, status, payment, deliveryAddress } = req.body;
  const validKeys = ['orders', 'status', 'payment', 'deliveryAddress'];
  const inputs = Object.keys(req.body);
  for (let i = 0; i < inputs.length; i++) {
    if (validateKeys(inputs[i], validKeys) === false) {
      return res.status(400).json({
        status: 'invalid key',
        message: 'please enter valid keys',
      });
    }
  }
  if (payment !== 'payondelivery') {
    return res.status(400).json({
      status: 'Failure',
      message: `Invalid data entry! payment values can't be ${req.body.payment}`,
    });
  }
  if (!validateText(deliveryAddress)) {
    return res.status(400).json({
      status: 'Failure',
      message: 'Invalid data entry! Check your Delivery Address field',
    });
  }
  if (!Array.isArray(req.body.orders)) {
    return res.status(400).json({
      status: "Failure",
      message: `Invalid data entry! orders should be of type array`,
    });
  }
  if (status !== 'pending') {
    return res.status(400).json({
      status: 'Failure',
      message: 'Invalid data entry for status',
    });
  }
  for (let order of orders){
    if (validateString(order.itemname)) {
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid Item Name, check your orders items',
      });
    }    
    if(typeof order.price !== 'number' || !validateNumber(order.price)){
      return res.status(400).json({
        status: 'failure',
        message: 'Invalid price value, check your orders items',
      });
    }
    if(typeof order.quantity !== 'number' || !validateNumber(order.quantity) ){
      return res.status(400).json({
        status: 'failure',
        message: `Invalid Quantity value, check your orders items`,
      });
    }
  }  
  return next();
};
