const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const signInAndUp = async () => {
  try {
    const mockUser = {
      email: 'testing@email.com',
      password: 'password',
    };
    const agent = await request.agent(app);
    const user = await agent.post('/api/v1/users').send(mockUser);
    return [agent, user];
  } catch (e) {
    console.error(e);
  }
};

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
    expect(res.body).toEqual({
      id: expect.any(String),
      email: mockUser.email,
      appGoal: expect.any(Number),
      networkGoal: expect.any(Number),
      meetupGoal: expect.any(Number),
      linkedinGoal: expect.any(Number),
      codeGoal: expect.any(Number),
    });
  });

  test('GET to /api/v1/users/me should return a signed in user`s information ', async () => {
    const [agent] = await signInAndUp();
    const me = await agent.get('/api/v1/users/me');
    expect(me.status).toBe(200);
    expect(me.body).toEqual({
      id: expect.any(String),
      email: 'testing@email.com',
      exp: expect.any(Number),
      iat: expect.any(Number),
      appGoal: expect.any(Number),
      networkGoal: expect.any(Number),
      meetupGoal: expect.any(Number),
      linkedinGoal: expect.any(Number),
      codeGoal: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
