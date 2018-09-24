import expect from 'expect';
import request from 'supertest';

import app from '../index';

const user = {
  username: 'christain5',
  firstname: 'christian',
  lastname: 'Bailey',
  password: 'password@1',
  deliveryAddress: '5 gbagada road, lagos',
  phoneNo: '012644814',
  email: 'xtain@yaho.com',
  imageUrl:  'http://googleimages.com/profile.jpeg',
};


/**
 * @param {string} ROute to test
 * @param {function} callback function to test route
 */
describe('/POST create new User', () => {
  it('should register new users', (done) => {
    request(app).post('/api/v1/auth/signup')
      .send(user)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toEqual('you have successfully signed up');
        expect(res.body.status).toEqual('Success');
      })
      .end(done);
  });
  it('should return 400 if username or email is taken', (done) =>{
    request(app).post('/api/v1/auth/signup')
      .send(user)
      .expect(400)
      .expect((res) => {
        expect(res.body.status).toEqual('failure');
        expect(res.body.message).toEqual('username or email is already taken');
      })
      .end(done);
  });
  it('should return 400 if any key is invalid', (done) =>{
    const inValidUser = {
      username: 'christain5',
      firstname: 'christian',
      surname: 'Bailey',
      password: 'password@1',
      deliveryAddress: '5 gbagada road, lagos',
      phoneNo: '012644814',
      email: 'xtain@yaho.com',
      imageUrl:  'http://googleimages.com/profile.jpeg',
    };
    request(app).post('/api/v1/auth/signup')
      .send(inValidUser)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('invalid key');
        expect(res.body.message).toEqual('please enter valid keys');
      })
      .end(done);
  });
  it('should return 400 if email is invalid', (done) =>{
    const inValidUser = {
      username: 'christain5',
      firstname: 'christian',
      lastname: 'Bailey',
      password: 'password@1',
      deliveryAddress: '5 gbagada road, lagos',
      phoneNo: '012644814',
      email: 'xtainyaho.com',
      imageUrl:  'http://googleimages.com/profile.jpeg',
    };
    request(app).post('/api/v1/auth/signup')
      .send(inValidUser)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('email is invalid');
      })
      .end(done);
  });
  it('should return 400 if imageURL is invalid', (done) =>{
    const inValidUser = {
      username: 'christain5',
      firstname: 'christian',
      lastname: 'Bailey',
      password: 'password@1',
      deliveryAddress: '5 gbagada road, lagos',
      phoneNo: '012644814',
      email: 'xtain@yahoo.com',
      imageUrl:  'http://googleimages.com/profile',
    };
    request(app).post('/api/v1/auth/signup')
      .send(inValidUser)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('Invalid image url');
      })
      .end(done);
  });
  it('should return 400 if phone number is invalid', (done) =>{
    const inValidUser = {
      username: 'christain5',
      firstname: 'christian',
      lastname: 'Bailey',
      password: 'password@1',
      deliveryAddress: '5 gbagada road, lagos',
      phoneNo: '012644',
      email: 'xtain@yahoo.com',
      imageUrl:  'http://googleimages.com/profile.jpeg',
    };
    request(app).post('/api/v1/auth/signup')
      .send(inValidUser)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('phone number entered is invalid');
        expect(res.body.message).toEqual(`ensure value type is a string and 9digit or 11digits phone number`);
      })
      .end(done);
  });
  it('should return 400 if username is invalid', (done) =>{
    const inValidUser = {
      username: 'christain%',
      firstname: 'christian',
      lastname: 'Bailey',
      password: 'password@1',
      deliveryAddress: '5 gbagada road, lagos',
      phoneNo: '012644814',
      email: 'xtain@yaho0.com',
      imageUrl:  'http://googleimages.com/profile.jpeg',
    };
    request(app).post('/api/v1/auth/signup')
      .send(inValidUser)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('invalid username');
        expect(res.body.message).toEqual('only special character of _ is allowed, and length > 6 or <= 25');
      })
      .end(done);
  });
});

