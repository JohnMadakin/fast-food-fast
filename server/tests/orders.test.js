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
