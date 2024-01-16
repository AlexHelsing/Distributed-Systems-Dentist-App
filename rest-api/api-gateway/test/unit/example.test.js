import supertest from 'supertest';
import { app } from '../../src/app';
import mongoose  from 'mongoose';

const request = supertest(app);

describe('Root response', () => {
  it('should return status code 200', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  afterAll(async() => {
    mongoose.disconnect();
  })
});
