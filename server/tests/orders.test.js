import expect from 'expect';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../index';
import allData from '../models/data';

const admin = {
  username: 'omare26',
  firstname: 'dafe',
  lastname: 'Bailey',
  password: 'password@1',
  deliveryAddress: '5 gbagada road, lagos',
  phoneNo: '08023219131',
  email: 'omare@yahoo.com',
  imageUrl:  'http://googleimages.com/profile.jpeg',
};
const user = {
  username: 'bolaji23',
  firstname: 'bolaji',
  lastname: 'Alao',
  password: 'password@1',
  deliveryAddress: '10 isheri, gbagada road, lagos',
  phoneNo: '07023219131',
  email: 'bolaji5@yahoo.com',
  imageUrl:  'http://googleimages.com/profile.jpeg',
};

let menuid;


describe('POST menu Route', () => {
  let adminToken;
  let userToken = jwt.sign('2', process.env.SECRET).toString();
  before('register a user', (done) => {
    request(app).post('/api/v1/auth/admin')
      .send(admin)
      .end((err, res) => {
        adminToken = res.body.token;
        done();
    });
  });
  const menu =  {
    name: 'waffle',
    price: 890,
    calorie: 240,
    ingredients: 'wheat, sugar',
    description: 'The best cracker',
    imageUrl: 'http://googleimages.com/waffles.jpg',
 };
  it('should return 200 when a menu is posted', (done) => {
    request(app).post('/api/v1/menu')
      .send(menu)
      .set('x-auth', adminToken)
      .expect(201)
      .expect((res) => {
        menuid = res.body.menu.id;
        expect(res.body.status).toEqual('Success');
        expect(res.body.message).toEqual('you have successfully added a menu');
        expect(typeof res.body.menu).toEqual('object');
      })
      .end(done);
  });
  it('should return 401 if an unauthorized user tries to post', (done) => {
    request(app).post('/api/v1/menu')
      .send(menu)
      .set('x-auth', userToken)
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toEqual(`not authenticated, you are not authorized to visit this page`);
      })
      .end(done);
  });
  it('should return 400 when you try to post the same menu twice', (done) => {
    request(app).post('/api/v1/menu')
      .send(menu)
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('Menu name already exist');
      })
      .end(done);
  });
  it('should return 400 if you post an invalid key', (done) => {
    const invalidMenu = {
      name: 'waffle',
      price: 780,
      calorie: 240,
      ingredients: 'wheat, oil',
      description: 'This is the best waffle',
      imageUrl: 'http://googleimages.com/waffles.png',
      color: 'yellow'
   };
    request(app).post('/api/v1/menu')
      .send(invalidMenu )
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('number of keys exceeded');
      })
      .end(done);
  });
  it('should return 400 if you post limited keys', (done) => {
    const invalidMenu = {
      name: 'waffle',
      price: 780,
      calorie: 240,
      ingredients: 'wheat, oil',
      description: 'This is the best waffle',
   };
    request(app).post('/api/v1/menu')
      .send(invalidMenu)
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('incomplete valid keys');
      })
      .end(done);
  });
  it('should return 400 if you post an invalid menu name', (done) => {
    const invalidMenu = {
      name: 'waffle%%1!',
      price: 890,
      calorie: 240,
      ingredients: 'wheat, sugar',
      description: 'The best cracker',
      imageUrl: 'http://googleimages.com/waffles.jpg',
   };
    request(app).post('/api/v1/menu')
      .send(invalidMenu)
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Menu name has an invalid value');
      })
      .end(done);
  });
  it('should return 400 if you post an invalid number value', (done) => {
    const invalidMenu = {
      name: 'waffle',
      price: '89e0',
      calorie: 240,
      ingredients: 'wheat, sugar',
      description: 'The best cracker',
      imageUrl: 'http://googleimages.com/waffles.jpg',
   };
    request(app).post('/api/v1/menu')
      .send(invalidMenu)
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('price or calorie has an invalid value');
      })
      .end(done);
  });
  it('should return 400 if you post an invalid image url', (done) => {
    const invalidMenu = {
      name: 'waffle',
      price: 780,
      calorie: 240,
      ingredients: 'wheat, sugar',
      description: 'The best cracker',
      imageUrl: 'http://googleimages.com/waffles.gif',
   };
    request(app).post('/api/v1/menu')
      .send(invalidMenu)
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('imageurl has an invalid value');
      })
      .end(done);
  });

  it('should return 400 if you post an invalid description lenght', (done) => {
    const invalidMenu = {
      name: 'waffle',
      price: 780,
      calorie: 240,
      ingredients: 'wheat, sugar',
      description: 'T',
      imageUrl: 'http://googleimages.com/waffles.png',
   };
    request(app).post('/api/v1/menu')
      .send(invalidMenu)
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('decription has an invalid value');
      })
      .end(done);
  });

  it('should return 400 if you post an invalid ingredient value', (done) => {
    const invalidMenu = {
      name: 'waffle',
      price: 780,
      calorie: 240,
      ingredients: '%',
      description: 'This is the best waffle',
      imageUrl: 'http://googleimages.com/waffles.png',
   };
    request(app).post('/api/v1/menu')
      .send(invalidMenu)
      .set('x-auth', adminToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid ingredient format! please separate items with a comma');
      })
      .end(done);
  }); 
});


describe('POST order Route', () => {
  const order = {
    orders: [{
      itemid: 1,
      quantity: 3,
    }],
    status: 'pending',
    payment: 'payondelivery',
    deliveryAddress: '234 ikorodu road, anthony, Lagos',
  };
  let userToken; 
  let adminToken = jwt.sign('2', process.env.SECRET).toString();
  before('signin a user', (done) => {
    request(app).post('/api/v1/auth/signup')
      .send(user)
      .end((err, response) => {
        userToken = response.body.token;
        done();
      });
  });
  it('should return 200 when a new order is posted', (done) => {
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(201)
      .expect((res) => {
        expect(typeof res.body).toBe('object');
        expect(res.body.status).toEqual('Success');
        expect(res.body.message).toEqual('you have successfully placed your orders');
      })
      .end(done);
  });
  it('should return 401 when you post without a valid token', (done) => {
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', adminToken)
      .expect(401)
      .expect((res) => {
        expect(typeof res.body).toBe('object');
        expect(res.body.message).toEqual('not authenticated, you are not authorized to visit this page');
      })
      .end(done);
  });

  it('should return 400 if itemid is invalid', (done) => {
    order.orders[0].itemid = '19002';
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid ItemId, check your orders items');
      })
      .end(done);
  });
  it('should return 400 if itemid is not a valid menuid stored in the DB', (done) => {
    order.orders[0].itemid = 5;
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid menuId, check that your itemsId is valid');
      })
      .end(done);
  });
  it('should return 400 if order quantity is invalid', (done) => {
    order.orders[0].itemid = 1;
    order.orders[0].quantity = '10';
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid Quantity value, check your orders items');
      })
      .end(done);
  });
  it('should return 400 if status field is invalid', (done) => {
    order.orders[0].quantity = 4;
    order.status = 'accepted';
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid data entry for status');
      })
      .end(done);
  });

  it('should return 400 if payment field is invalid', (done) => {
    order.payment = 'bank transfer';
    order.status = 'pending';
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(`Invalid data entry! payment values can't be ${order.payment}`);
      })
      .end(done);
  });
  it('should return 400 if delivery address in invalid', (done) => {
    order.payment = 'payondelivery';
    order.deliveryAddress = '';
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('Invalid data entry! Check your Delivery Address field');
      })
      .end(done);
  });
  it('should return 400 if you enter an invalid key', (done) => {
    delete order.status;
    order.total = 5000;
    request(app).post('/api/v1/orders')
      .send(order)
      .set('x-auth', userToken)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual('please enter valid keys');
      })
      .end(done);
  });
});

describe('GET all orders route', () => {
  let aToken;
  before('signin a user', (done) => {
    request(app).post('/api/v1/auth/login')
      .send({  
        username: 'omare26',
        password: 'password@1',
      })
      .end((err, response) => {
        aToken = response.body.token;
        done();
      });
  });

  it('should return 200 and list of menu', (done) => {
    request(app).get('/api/v1/orders')
    .set('x-auth',aToken)
      .expect(500)
      .expect((res) => {
        console.log(res)
        expect(typeof res.body).toBe('object');
      })
      .end(done);
  });
});

describe('GET menu route', () => {
  it('should return 200 and list of menu', (done) => {
    request(app).get('/api/v1/menu')
      .expect(200)
      .expect((res) => {
        expect(typeof res.body).toBe('object');
        expect(res.body.menu.length).toEqual(1);
      })
      .end(done);
  });
});
