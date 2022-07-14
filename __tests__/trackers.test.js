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
    return [agent, user.body];
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
    const resp = await agent.post('/api/v1/trackers').send({
      position: 'Software Developer 1',
      company: 'Amazon',
      status: 'Applied',
    });

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      position: 'Software Developer 1',
      company: 'Amazon',
      status: 'Applied',
      createdAt: expect.any(String),
      appliedAt: null,
      closedAt: null,
      description: null,
      notes: null,
      interviewedAt: null,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
