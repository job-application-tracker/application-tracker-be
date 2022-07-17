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

describe('achievements routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  test('POST to /api/v1/achievements should create a row of achievements for the user', async () => {
    const [agent, user] = await signInAndUp();
    const resp = await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 27,
    });
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      appNum: 0,
      networkNum: 0,
      meetupNum: 0,
      linkedinNum: 0,
      codeNum: 0,
      year: expect.any(Number),
      week: expect.any(Number),
    });
  });
  test('GET /api/v1/achievements/week should return the list of achievements for the specified week for the user', async () => {
    const [agent, user] = await signInAndUp();
    await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 27,
    });
    const resp2 = await agent.get(
      '/api/v1/achievements/week?year=2022&week=27'
    );
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      appNum: 0,
      networkNum: 0,
      meetupNum: 0,
      linkedinNum: 0,
      codeNum: 0,
      year: 2022,
      week: 27,
    });
  });
  test('PUT /api/v1/achievements/week should update the list of achievements', async () => {
    const [agent, user] = await signInAndUp();
    await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 27,
    });
    const resp = await agent
      .put('/api/v1/achievements/week?year=2022&week=27')
      .send({
        appNum: 1,
      });
    expect(resp.status).toEqual(200);

    const resp2 = await agent.get(
      '/api/v1/achievements/week?year=2022&week=27'
    );
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      appNum: 1,
      networkNum: 0,
      meetupNum: 0,
      linkedinNum: 0,
      codeNum: 0,
      year: 2022,
      week: 27,
    });
  });
  test('GET /api/v1/achievements/sums should return the aggregate totals for a user', async () => {
    const [agent, user] = await signInAndUp();
    await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 27,
    });
    const resp1 = await agent
      .put('/api/v1/achievements/week?year=2022&week=27')
      .send({
        appNum: 1,
        networkNum: 3,
        meetupNum: 5,
        linkedinNum: 3,
        codeNum: 4,
      });
    expect(resp1.status).toEqual(200);
    await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 28,
    });
    const resp2 = await agent
      .put('/api/v1/achievements/week?year=2022&week=28')
      .send({
        appNum: 1,
        networkNum: 1,
        meetupNum: 1,
        linkedinNum: 1,
        codeNum: 1,
      });
    expect(resp2.status).toEqual(200);
    const resp3 = await agent.get('/api/v1/achievements/sums');
    expect(resp3.status).toEqual(200);
    expect(resp3.body).toEqual({
      userId: user.id,
      appSum: 2,
      networkSum: 4,
      meetupSum: 6,
      linkedinSum: 4,
      codeSum: 5,
    });
  });
  test('GET /api/v1/achievements should return the weekly totals for a user', async () => {
    const [agent, user] = await signInAndUp();
    await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 27,
    });
    const resp1 = await agent
      .put('/api/v1/achievements/week?year=2022&week=27')
      .send({
        appNum: 1,
        networkNum: 3,
        meetupNum: 5,
        linkedinNum: 3,
        codeNum: 4,
      });
    expect(resp1.status).toEqual(200);
    await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 28,
    });
    const resp2 = await agent
      .put('/api/v1/achievements/week?year=2022&week=28')
      .send({
        appNum: 1,
        networkNum: 1,
        meetupNum: 1,
        linkedinNum: 1,
        codeNum: 1,
      });
    expect(resp2.status).toEqual(200);
    const resp3 = await agent.get('/api/v1/achievements');
    expect(resp3.status).toEqual(200);
    expect(resp3.body).toEqual([
      {
        id: expect.any(String),
        userId: user.id,
        year: 2022,
        week: 27,
        appNum: 1,
        networkNum: 3,
        meetupNum: 5,
        linkedinNum: 3,
        codeNum: 4,
      },
      {
        id: expect.any(String),
        userId: user.id,
        year: 2022,
        week: 28,
        appNum: 1,
        networkNum: 1,
        meetupNum: 1,
        linkedinNum: 1,
        codeNum: 1,
      },
    ]);
  });
  afterAll(() => {
    pool.end();
  });
});
