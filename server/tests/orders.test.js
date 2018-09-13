import expect from 'expect';
import request from 'supertest';

import app from '../index';

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
