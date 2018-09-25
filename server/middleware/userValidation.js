export const validateStringLength = (string) => {
  if (string.length >= 6 && string.length <= 300) {
    return true;
  }
  return false;
};

/**
 *  regex: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 * returns a token for the new user to sign in
 * @param {string} email
 */
export const checkValidEmail = (email) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = reg.test(String(email).toLowerCase());
  if (!isValid) return false;
  return true;
};

export const validateText = (text) => {
  const validText = /^[0-9a-zA-Z\s #$&()%;,_@+|?!\.\-]+$/;
  if (text.length >= 10 && text.length <= 150 && !!text.match(validText)) {
    return true;
  }
  return false;
};

export const validatePhoneNo = (phone) => {
  const validPhoneChar = /^[0][1-9]\d{7}$|^[0][7-9][0-9][0-9]\d{7}$/g;
  return phone.trim().match(validPhoneChar);
};


export const validateImageUrl = (url) => {
  const reg = /\.(jpe?g|png|)$/i;
  if (reg.test(url)) return true;
  return false;
};

export const validateString = (string) => {
  if (typeof string !== 'string') return false;
  if (string.length < 2 || string.length > 25) return false;
  const validString = /^[a-zA-Z-]+$/;
  return string.trim().match(validString);
};

export const validateUserText = (string) => {
  if (typeof string !== 'string') return false;
  if (string.length < 6 || string.length > 25) return false;
  const validString = /^[0-9a-zA-Z_]+$/;
  return string.trim().match(validString);
};


export const validateLoginDetail = (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  const inputs = Object.keys(req.body);
  const validKeys = ['username', 'password'];
  for (let key of inputs) {
    if (!validKeys.includes(key)) {
      return res.status(400).json({
        error: `${key} is an Invalid key. Keys should be sent as username and password`,
      });
    }
  }
  if (!validateUserText(username)) {
    return res.status(400).json({
      status: 'error',
      message: 'invalid username',
    });
  }
  return next();
};

export const validateKeys = (key, validKeys) => {
  if (!validKeys.includes(key)) {
    return false;
  }
  return true;
};

export const validateKeysLength = (res, inputs, validKeys) => {
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
  return true;
};

export const validateUser = (req, res, next) => {
  const {
    email,
    username,
    password,
    deliveryAddress,
    phoneNo,
    firstname,
    lastname,
    imageUrl,
  } = req.body;
  const validKeys = ['firstname', 'lastname', 'email', 'username', 'deliveryAddress', 'phoneNo', 'password', 'imageUrl'];
  const inputs = Object.keys(req.body);
  validateKeysLength(res, inputs, validKeys);
  for (let i = 0; i < inputs.length; i++) {
    if (validateKeys(inputs[i], validKeys) === false) {
      return res.status(400).json({
        error: 'invalid key',
        message: 'please enter valid keys',
      });
    }
  }
  if (!validateUserText(username)) {
    return res.status(400).json({
      error: 'invalid username',
      message: 'only special character of _ is allowed, and length > 6 or <= 25',
    });
  }
  if (!validateString(firstname)) {
    return res.status(400).json({
      error: 'firstname or lastname entered is invalid',
    });
  }
  if (!validateString(lastname)) {
    return res.status(400).json({
      error: 'firstname or lastname entered is invalid',
    });
  }
  if (!validateStringLength(password)) {
    return res.status(400).json({
      error: 'Invalid password length',
    });
  }
  if (!validateText(deliveryAddress)) {
    return res.status(400).json({
      error: 'Address entered is invalid',
    });
  }
  if (!validatePhoneNo(phoneNo)) {
    return res.status(400).json({
      error: 'phone number entered is invalid',
      message: 'ensure value type is a string and 9digit or 11digits phone number',
    });
  }
  if (!checkValidEmail(email)) {
    return res.status(400).json({
      error: 'email is invalid',
    });
  }
  if (!validateImageUrl(imageUrl) && imageUrl !== '') {
    return res.status(400).json({
      error: 'Invalid image url',
    });
  }
  return next();
};
