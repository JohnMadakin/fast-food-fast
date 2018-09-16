const validateString = (string) => {
  if (typeof string !== 'string') return false;
  const validString = /^[0-9a-zA-Z& \-]+$/;
  return string.trim().match(validString);
};

const validateStringLength = (string) => {
  if (string.length >= 6 && string.length <= 40) {
    return true;
  }
  return false;
};

const validateText = (text) => {
  const validText = /^[0-9a-zA-Z\s #$&()%;,_@+|?!\.\-]+$/;
  if (text.length >= 10 && text.length <= 150 && !!text.match(validText)) {
    return true;
  }
  return false;
};

const validateImageUrl = (url) => {
  const reg = /\.(jpe?g|png|)$/i;
  if (reg.test(url)) return true;
  return false;
};

const validateNumber = (number) => {
  const validator = `${number}`;
  if (validator.length > 5) {
    return false;
  }
  return true;
};
const validateID = (id) => {
  const reg = /^[0-9]+$/;
  if (reg.test(id)) {
    return false;
  }
  return true;
}

const validate = (req, res, next) => {
  const { id } = req.params;
  const inputs = Object.keys(req.body);
  const validKeys = ['calorie', 'userId', 'status', 'description', 'imageUrl', 'title', 'payment', 'price', 'ingredient'];
  const validString = ['status', 'description', 'imageUrl', 'title', 'payment', 'ingredient'];
  const validNumFields = ['userId', 'calorie', 'price'];
  const validStatus = ['accepted', 'pending', 'rejected', 'confirmed'];
  const payment = ['payment on delivery', 'card', 'bank transfer'];
  if (id && validateID(id)) {
    return res.status(400).json({
      error: 'Invalid ID! Check the is a valid ID in the url',
    });
  }
  for (let key of inputs) {
    if (!validKeys.includes(key)) {
      return res.status(400).json({
        error: `${key} is an Invalid key`,
      });
    }
    if (key === 'status' && !validStatus.includes(req.body[key])) {
      return res.status(400).json({
        error: `Invalid data entry! status values can't be ${req.body[key]}`,
      });
    }
    if (key === 'ingredient' && !Array.isArray(req.body[key])) {
      return res.status(400).json({ error: `Invalid ingredient format. ${key} Should be an Array`});
    }
    if (key === 'payment' && !payment.includes(req.body[key])) {
      return res.status(400).json({
        error: `Invalid Payment field, Payment value can't be ${req.body[key]}`,
      });
    }
    if (typeof req.body[key] === 'string' && !validString.includes(key)) {
      return res.status(400).json({
        error: `${key} is an Invalid field type.${key} cannot be a string`,
      });
    }
    if (typeof req.body[key] === 'string' && !validateString(req.body[key]) && key !== 'imageUrl' && key !== 'description' && key !== 'ingredient' && key !== 'payment') {
      return res.status(400).json({
        error: `Invalid String Field. check the ${key} field`,
      });
    }
    if (typeof req.body[key] === 'string' && key !== 'payment' && key !== 'description' && !validateStringLength(req.body[key])) {
      return res.status(400).json({
        error: 'Invalid String length. min = 8, max = 40',
      });
    }
    if (typeof req.body[key] === 'number' && !validNumFields.includes(key)) {
      return res.status(400).json({
        error: `${key} is an Invalid field type. Only price, calorie and UserId can be Numbers`,
      });
    }
    if (typeof req.body[key] === 'number' && !validateNumber(req.body[key])) {
      return res.status(400).json({
        error: `Invalid Number Value for ${key}.`,
      });
    }
    if (key === 'description' && !validateText(req.body[key])) {
      return res.status(400).json({
        error: 'Invalid Description. Check text length',
      });
    }
    if (key === 'imageUrl' && !validateImageUrl(req.body[key])) {
      return res.status(400).json({
        error: 'Invalid image url',
      });
    }
  }
  next();
};

export default validate;
