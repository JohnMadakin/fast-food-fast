import expect from 'expect';
import request from 'supertest';

import app from '../index';
import allData from '../models/data';

describe('Get all Orders', () => {
 
  it('should get all the orders', (done) => {
    request(app).get('/api/v1/orders')
      .expect(200)
      .expect((res) => {
        const { data } = res.body;
        expect(data.length).toBeGreaterThan(0);
        expect(data.length).toBe(2);
      })
      .end(done);
  });
});
describe('Get single order based on ID', () => {
  it('should return 200 if ID is found', (done) => {
    const id = 1;
    request(app).get(`/api/v1/orders/${id}`)
      .expect(200)
      .expect((res) => {
        const { order } = res.body;
        const { ordersData } = allData;
        expect(order).toEqual(ordersData[0]);
        expect(typeof order).toBe('object');
      })
      .end(done);
  });
  it('should return 404 if ID is not found', (done) => {
    const id = 100;
    const msg = 'order not found';
    request(app).get(`/api/v1/orders/${id}`)
      .expect(404)
      .expect((res) => {
        const { error } = res.body;
        expect(error).toBe(msg);
      })
      .end(done);
  });
  it('should return 400 if ID is invalid', (done) => {
    const id = 'akkjl23';
    const msg = 'Invalid order Id';
    request(app).get(`/api/v1/orders/${id}`)
      .expect(400)
      .expect((res) => {
        const { error } = res.body;
        expect(error).toBe(msg);
      })
      .end(done);
  });
});

describe('POST order Route', () => {
  const order = {
    userId: 4,
    title: 'SpiceyChicken',
    description: 'This is the best spicey Chicken',
    price: 1250,
    status: 'pending',
    payment: 'card',
    ingredient: ['chicken', 'ketchup', 'onion'],
    calorie: 450,
    imageUrl: 'spicey-chicken.png'
  };
  it('should return 200 when an order is posted', (done) => {
    const url = 'http://localhost:3002/server/public/spicey-chicken.png';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(200)
      .expect((res) => {
        expect(typeof res.body).toBe('object');
        expect(res.body.order.id).toEqual(3);
        expect(res.body.order.imageUrl).toBe(url);
        expect(allData.ordersData.length).toBe(3);
      })
      .end(done);
  });
  it('should return 400 if you send a number as title', (done) => {
    order.title = 19002;
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe(`title is an Invalid field type. Only price, calorie and UserId can be Numbers`);
      })
      .end(done);
  });
  it('should return 400 if a field is missing', (done) => {
    order.title = '';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid String Field. check the title field');
      })
      .end(done);
  });
  it('should return 400 if imageUrl field is not a jpg,jpeg or png', (done) => {
    order.title = 'Spicey-Chicken';
    order.imageUrl = 'chicken-spicey.gif';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid image url');
      })
      .end(done);
  });
  it('should return 400 if ingredient field is not an array', (done) => {
    order.imageUrl = 'chicken-spicey.jpg';
    order.ingredient = 'chicken, sauce';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid ingredient format. ingredient Should be an Array');
      })
      .end(done);
  });
  it('should return 400 if payment field is invalid', (done) => {
    order.ingredient = ['chicken', 'sauce'];
    order.payment = 'transfer';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid Payment field, Payment value can\'t be transfer');
      })
      .end(done);
  });

  it('should return 400 if invalid price,calorie or userId is entered', (done) => {
    order.payment = 'bank transfer';
    order.price = '15o0';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('price is an Invalid field type.price cannot be a string');
      })
      .end(done);
  });
  it('should return 400 if invalid status is entered', (done) => {
    order.price = 1500;
    order.status = 'acept';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid data entry! status values can\'t be acept');
      })
      .end(done);
  });

  it('should return 400 if invalid title is entered', (done) => {
    order.status = 'accepted';
    order.title = 'chicken?peppersoup';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid String Field. check the title field');
      })
      .end(done);
  });

  it('should return 400 if invalid description length is entered', (done) => {
    order.title = 'chicken peppersoup';
    order.description = 'chicken';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid Description. Check text length');
      })
      .end(done);
  });
  it('should return 400 if you enter an invalid key', (done) => {
    order.description = 'This is the best spicey Chicken';
    order.orderTitle = 'cheese burger';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('orderTitle is an Invalid key');
      })
      .end(done);
  });
  
});

describe('Update status using PATCH Route', () => {
  const id = 3;
  it('should return 200 when an order is updated', (done) => {
    const status = {
      status: 'accepted',
    };
    request(app).patch(`/api/v1/orders/${id}`)
      .send(status)
      .expect(200)
      .expect((res) => {
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message).toBe('Resource Updated Successfully!');
        expect(allData.ordersData[0].status).toBe('accepted');
      })
      .end(done);
  });
  it('should return 400 if ID is invalid', (done) => {
    const inValidId = '1klwklr';
    const status = {
      status: 'accepted',
    };
    request(app).patch(`/api/v1/orders/${inValidId}`)
      .send(status)
      .expect(400)
      .expect((res) => {
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toBe('Invalid ID! Check the is a valid ID in the url');
      })
      .end(done);
  });
  it('should return 400 if inputed value is invalid', (done) => {
    const status = {
      status: 'accept',
    };
    request(app).patch(`/api/v1/orders/${id}`)
      .send(status)
      .expect(400)
      .expect((res) => {
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toBe(`Invalid data entry! status values can't be ${status.status}`);
      })
      .end(done);
  });
  it('should return 404 if ID is not found', (done) => {
    const status = {
      status: 'accepted',
    };
    const validId = 10;
    request(app).patch(`/api/v1/orders/${validId}`)
      .send(status)
      .expect(404)
      .expect((res) => {
        expect(typeof res.body.error).toBe('string');
        expect(res.body.error).toBe('Resource Not found!');
      })
      .end(done);
  });
});
