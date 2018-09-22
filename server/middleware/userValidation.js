export default class ValidateUser {
  constructor() {
    this.validateProfileImage = this.validateProfileImage.bind(this);
    this.validatePasswordLength = this.validatePasswordLength.bind(this);
    this.validatePhoneNo = this.validatePhoneNo.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validateAddress = this.validateAddress.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
  }

  validateNumber(number) {
    const validator = `${number}`;
    if (validator.length > 5) {
      return false;
    }
    return true;
  }

  validateID(id) {
    const reg = /^[0-9]+$/;
    if (reg.test(id)) {
      return false;
    }
    return true;
  }

  validateStringLength(string) {
    if (string.length >= 6 && string.length <= 300) {
      return true;
    }
    return false;
  }

  /**
   * Regex Source: * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
   * returns a token for the new user to sign in
   * @param {string} email
  **/

  checkValidEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = reg.test(String(email).toLowerCase());
    if (!isValid) return false;
    return true;
  }

  validateEmail(res, key, email) {
    if (key === 'email' && !this.checkValidEmail(email)) {
      return res.status(400).json({
        error: `${key} is invalid`,
      });
    }
    return true;
  }

  validateText(text) {
    const validText = /^[0-9a-zA-Z\s #$&()%;,_@+|?!\.\-]+$/;
    if (text.length >= 10 && text.length <= 150 && !!text.match(validText)) {
      return true;
    }
    return false;
  }

  validateAddress(res, key, address) {
    if ((key === 'homeAddress' || key === 'deliveryAddress') && !this.validateText(address)) {
      return res.status(400).json({
        error: `${key} entered is invalid`,
      });
    }
    return true;
  }

  validatePasswordLength(res, key, psw) {
    if (key === 'imageUrl' && !this.validateStringLength(psw)) {
      return res.status(400).json({
        error: 'Invalid password length',
      });
    }
    return true;
  }

  validatePhoneNo(res, key, phoneNo) {
    if (key === 'phoneNo' && !this.validateNumber(phoneNo)) {
      return res.status(400).json({
        error: `${key} entered is invalid`,
      });
    }
    return true;
  }

  validateName(res, key, name) {
    if ((key === 'firstname' || key === 'lastname') && !this.validateString(name)) {
      return res.status(400).json({
        error: `${key} entered is invalid`,
      });
    }
    return true;
  }

  validateImageUrl(url) {
    const reg = /\.(jpe?g|png|)$/i;
    if (reg.test(url)) return true;
    return false;
  }

  validateProfileImage(res, key, image) {
    if (key === 'imageUrl' && !this.validateImageUrl(image)) {
      return res.status(400).json({
        error: 'Invalid image url',
      });
    }
    return true;
  }

  validateString(string) {
    if (typeof string !== 'string') return false;
    if (string.length < 2 || string.length > 25) return false;
    const validString = /^[a-zA-Z-]+$/;
    return string.trim().match(validString);
  }

  validateUserText(string) {
    if (typeof string !== 'string') return false;
    if (string.length < 6 || string.length > 25) return false;
    const validString = /^[0-9a-zA-Z-_]+$/;
    return string.trim().match(validString);
  }

  validateUsername(res, key, string) {
    if (key === 'username' && !this.validateUserText(string)) {
      return res.status(400).json({
        error: 'Invalid username',
      });
    }
    return true;
  }

  validateLoginDetail(req, res, next) {
    const { username, password } = req.body;
    const inputs = Object.keys(req.body);
    const validKeys = ['username', 'password'];
    for (let key of inputs) {
      if (!validKeys.includes(key)) {
        return res.status(400).json({
          error: `${key} is an Invalid key. Keys should be sent as username and password`,
        });
      }
      this.validateUsername(username);
      this.validatePasswordLength(password);
    }
    return next();
  }
  
  validateUser(req, res, next) {
    const {
      id
    } = req.params;
    const inputs = Object.keys(req.body);
    const validKeys = ['firstname', 'lastname', 'email', 'username', 'homeAddress', 'deliveryAddress', 'phoneNo', 'password', 'imageUrl'];
    if (id && this.validateID(id)) {
      return res.status(400).json({
        error: 'Invalid ID! Check that ID',
      });
    }
    for (let key of inputs) {
      if(key === 'imageUrl' && res.body[key] == ""){
        next();
      }
      if (!validKeys.includes(key)) {
        return res.status(400).json({
          error: `${key} is an Invalid key`,
        });
      }
      this.validateEmail(res, key, req.body[key]);
      this.validateAddress(res, key, req.body[key]);
      this.validatePhoneNo(res, key, req.body[key]);
      this.validateName(res,key, req.body[key]);
      this.validateProfileImage(res,key, req.body[key]);
      this.validatePasswordLength(res,key, req.body[key]);
      this.validateUsername(res,key, req.body[key]);
    }
    return next();
  }
}
