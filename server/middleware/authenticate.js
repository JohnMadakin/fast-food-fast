import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class Authenticate {
  constructor() {
    this.authenticateAdmin = this.authenticateAdmin.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  authenticateAdmin(req, res, next) {
    const token = req.header('x-auth');
    if (!token) {
      return res.status(401)
        .json({
          message: 'not authenticated, please sign in',
        });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      if ( process.env.ADMINCODE !== decoded.usertype) {
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
    if (!token) {
      return res.status(401)
        .json({
          message: 'not authenticated, please sign in',
        });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      if (process.env.USERCODE !== decoded.usertype) {
        return res.status(401)
          .json({
            message: 'not authenticated, you are not authorized to visit this page',
          });
      }
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({
        status: 'auth error',
        message: e,
      });
    }
    return true;
  }
}
