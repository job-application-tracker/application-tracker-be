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
  test('DELETE to /api/v1/users/sessions should sign out a user', async () => {
    const [agent] = await signInAndUp();

    const out = await agent.delete('/api/v1/users/sessions');

    expect(out.status).toBe(200);
    expect(out.body).toEqual({ message: 'Successfully signed out.' });
  });
  test('PUT to /api/v1/users/:id should update user profile', async () => {
    const [agent, user] = await signInAndUp();
    const res = await agent.put(`/api/v1/users/${user.body.id}`).send({
      appGoal: 2,
      networkGoal: 5
    });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'testing@email.com',
      appGoal: 2,
      networkGoal: 5,
      meetupGoal: expect.any(Number),
      linkedinGoal: expect.any(Number),
      codeGoal: expect.any(Number),
    });
  });
  test('PUT /api/v1/users/:id should return a 403 if the user is not authorized', async () => {
    const [agent] = await signInAndUp();
    const newUser = await UserService.signUp({ email: 'testing2@email.com', password: '123456' });
    const res = await agent.put(`/api/v1/users/${newUser.id}`).send({
      appGoal: 2
    });
    expect(res.status).toEqual(403);
  });
  afterAll(() => {
    pool.end();
  });
});
