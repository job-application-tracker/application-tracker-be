const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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

describe('tracker routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  test('POST to /api/v1/trackers should add job information', async () => {
    const [agent, user] = await signInAndUp();
    const resp = agent.post('/api/v1/trackers').send({
      position: 'Software Developer 1',
      company: 'Amazon',
      status: 'Applied',
    });

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      userId: user.body.id,
      position: 'Software Developer 1',
      company: 'Amazon',
      status: 'Applied',
      createdAt: expect.any(Date),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
