const setup = require('../data/setup');
const app = require('../lib/app');
const { request } = require('../lib/app');
const pool = require('../lib/utils/pool');

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
  test('POST to /api/v1/achievements should update achievements for the user', async () => {
    const [agent, user] = await signInAndUp();
    const resp = await agent.post('/api/v1/achievements').send({
      userId: user.id,
      year: 2022,
      week: 27
    });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      appNum: 0,
      networkNum: 0,
      meetupNum: 0,
      linkedinNum: 0,
      codeNum: 0,
      year: expect.any(Number),
      week: expect.any(Number)
    });
  });
  afterAll(() => {
    pool.end();
  });
});
