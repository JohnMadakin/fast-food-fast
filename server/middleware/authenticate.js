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
    const { usertype } = user;
    
    return true;
  }

  authenticateAdmin(req, res, next) {
    const token = req.header('x-auth');
    this.checkToken(token, res);
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      if (bcrypt.compareSync(process.env.ADMINCODE, decoded.usertype) === false) {
        return res.status(401)
          .json({
            message: 'not authenticated, you are not authorized to visit this page',
          });
      }
      req.user = decoded;
      return next();
    } catch (e) {
      return res.status(401).json({
        status: 'auth error',
        message: e,
      });
    }
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
