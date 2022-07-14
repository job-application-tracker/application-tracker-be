const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { jobData } = require('../data/jobs');

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
  test('GET to /api/v1/trackers should return all the jobs the user has made', async () => {
    const [agent, user] = await signInAndUp();
    await Promise.all(
      jobData.map((job) => agent.post('/api/v1/trackers').send(job))
    );
    const resp = await agent.get('/api/v1/trackers');

    expect(resp.status).toBe(200);
    expect(resp.body.every((item) => item.userId === user.id)).toBe(true);
    expect(resp.body.length > 1).toBe(true);
    expect(resp.body[0]).toEqual({
      id: expect.any(String),
      userId: user.id,
      position: 'Software Developer 1',
      company: 'Amazon',
      status: 'Applied',
      createdAt: expect.any(String),
    });
  });
  test('GET to /api/v1/trackers/:id should return all the data about the job', async () => {
    const [agent, user] = await signInAndUp();
    const post = await agent.post('/api/v1/trackers').send({
      position: 'Software Developer 1',
      company: 'Amazon',
      status: 'Applied',
      notes:
        'Really like the flexibility of the job and the contact was super helpful.',
    });

    const resp = await agent.get(`/api/v1/trackers/${post.id}`);

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
      notes:
        'Really like the flexibility of the job and the contact was super helpful.',
      interviewedAt: null,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
