import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import db from '../db/dbconnection';

dotenv.config();


export default class Users {
  constructor() {
    this.userSignUp = this.userSignUp.bind(this);
    this.generateAuthToken = this.generateAuthToken.bind(this);
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


}
