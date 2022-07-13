const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  test('POST to /api/v1/users should sign a user up and return the data', async () => {
    const mockUser = {
      email: 'testing@email.com',
      password: 'password',
    };
    const res = await request(app).post('/api/v1/users').send(mockUser);
    expect(res.status).toBe(200);
  });
  afterAll(() => {
    pool.end();
  });
});
