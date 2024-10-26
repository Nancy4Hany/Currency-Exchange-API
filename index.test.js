const request = require('supertest');
const server = require('./index'); 
jest.setTimeout(10000); // Global 10-second timeout

describe('Currency Exchange API', () => {
  test('POST /api/exchange - success', async () => {
    const response = await request(server).post('/api/exchange').send({
      source: 'inr',
      targets: ['usd', 'aed', 'eur'],
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('inr_usd');
    expect(response.body).toHaveProperty('inr_aed');
    expect(response.body).toHaveProperty('inr_eur');
  });

  test('POST /api/exchange - missing parameters', async () => {
    const response = await request(server).post('/api/exchange').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid input: source and targets are required.');
  });

  test('POST /api/exchange - rate limit exceeded', async () => {
    // Exceed the rate limit
    for (let i = 0; i < 21; i++) {
      await request(server)
        .post('/api/exchange')
        .send({ source: 'inr', targets: ['usd', 'aed', 'eur'] });
    }
  
    // one more request to trigger the rate limit
    const response = await request(server)
      .post('/api/exchange')
      .send({ source: 'inr', targets: ['usd', 'aed', 'eur'] });
  
    expect(response.status).toBe(429);
    expect(response.body).toHaveProperty('error', 'Too many requests, please try again later.');
  });
  
});

afterAll((done) => {
  server.close(done);  // Close the server instance
});
