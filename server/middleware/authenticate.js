import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export default class Authenticate {
  constructor() {
    this.authenticateAdmin = this.authenticateAdmin.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  checkToken(token, res) {
    if (!token) {
      return res.status(401)
        .json({
          message: 'not authenticated, please sign in',
        });
    }
    return true;
  }

  checkUserType(user, res) {
    const { userType } = user;
    if (!bcrypt.compareSync(userType, process.env.USERCODE)) {
      return res.status(401)
        .json({
          message: 'not authenticated, you are not authorized to visit this page',
        });
    }
    return true;
  }

  authenticateAdmin(req, res, next) {
    const token = req.header('x-auth');
    this.checkToken(token, res);
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      this.checkUserType(req.user, res);
      next();
    } catch (e) {
      return res.status(401).json({
        message: e,
      });
    }
    return true;
  }

  authenticateUser(req, res, next) {
    const token = req.header('x-auth');
    this.checkToken(token, res);
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({
        message: e,
      });
    }
    return true;
  }
}
