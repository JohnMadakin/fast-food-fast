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
    payment: 'paymentondelivery',
    ingredient: ['chicken', 'ketchup', 'onion'],
    calorie: 450,
    imageUrl: 'spicey-chicken.png'
  };
  it('should return 201 when an order is posted', (done) => {
    const url = 'http://localhost:3002/spicey-chicken.png';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(201)
      .expect((res) => {
        expect(typeof res.body).toBe('object');
        expect(res.body.order.id).toEqual(3);
        expect(res.body.order.imageUrl).toBe(url);
        expect(allData.ordersData.length).toBe(3);
      })
      .end(done);
  });
  it('should return 400 if a field is missing', (done) => {
    order.title = "";
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('All the fields are required, Check correct values are inputed');
      })
      .end(done);
  });

  it('should return 400 if invalid price,calorie or userId is entered', (done) => {
    order.title = 'SpiceyChicken';
    order.price = '15o0';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid price, calorie or userId field');
      })
      .end(done);
  });

  it('should return 400 if invalid title,description or status is entered', (done) => {
    order.price = 1500;
    order.title = 'chicken?peppersoup';
    request(app).post('/api/v1/orders')
      .send(order)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid title, payment or status field');
      })
      .end(done);
  });
});
