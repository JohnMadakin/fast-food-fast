import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import db from '../db/dbconnection';

dotenv.config();


export default class Users {
  constructor() {
    this.userSignUp = this.userSignUp.bind(this);
    this.userSignIn = this.userSignIn.bind(this);
    this.generateAuthToken = this.generateAuthToken.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  /**
   * generates a token by user id
   * @param {object} userData
   * @returns {string} token
   */
  generateAuthToken(data) {
    const { username, userType, id } = data.username;
    return jwt.sign({ id, username, userType }, process.env.SECRET).toString();
  }

  /**
   * generates a hash for user type
   */
  hashUser() {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(process.env.USERCODE, salt);
  }

  /**
   * @param {object} req 
   * @param {object} res
   *
   */
  userSignUp(req, res) {
    const userType = this.hashUser();
    this.saveUser(req, res, userType);
  }

  /** this function is called by both the userSignup and adminSignup to save users
   * @param {object} req 
   * @param {object} res
   *
   */
  saveUser(req, res, userType) {
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
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        db.one('INSERT INTO users(firstname, lastname,phoneNo,deliveryAddress,imageurl, usertype, username,password, email) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,username,imageurl,firstname, usertype', [firstname, lastname, phoneNo, deliveryAddress, imageUrl, userType, username, hash, email])
          .then((data) => {
            const token = this.generateAuthToken(data);
            return res.header('x-auth', token)
              .status(201)
              .json({
                token,
                status: 'Success',
                message: 'you have successfully signed up',
              });
          }, (error) => {
            if (error.code === '23505') {
              return res.status(400).json({
                status: 'failure',
                message: 'username or email is already taken',
              });
            }
            return res.status(400).json({
              status: 'failure',
              message: 'signup unsuccessful',
              errorcode: error,
            });
          })
          .catch(() => {
            return res.status(500).json({
              err: 'Error Registering You',
            });
          });
      });
    });
  }

  /**
 * Method to sign Users in
 * @param {object} req
 * @param {object} res
 */
  userSignIn(req, res) {
    const { username, password } = req.body;
    db.one('SELECT * FROM users where username = $1', username)
      .then((data) => {
        bcrypt.compare(password, data.password, (err, result) => {
          if (result) {
            const user = {
              id: data.id,
              username: data.username,
              firstname: data.firstname,
              userCode: data.usertype,
              imageUrl: data.imageurl,
              address: data.deliveryaddress,
            };
            const token = this.generateAuthToken(user);
            return res.header('x-auth')
              .json({
                status: 'Success',
                message: 'you have successfully signed in',
                token,
              });
          }
          return res.status(400).json({
            status: 'not authenticated',
            message: 'invalid password',
          });
        })
      })
      .catch((err) => {
        if (err.code === 0) {
          return res.status(400).json({
            message: 'invalid username',
          });
        }
        return res.status(500).json({
          message: 'server error',
          err,
        });
      });
  }
}
