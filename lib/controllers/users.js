const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');

const router = Router();
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

router.post('/', async (req, res, next) => {
  try {
    const user = await UserService.signUp(req.body);
    const token = await UserService.signIn(req.body);
    res
      .cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.SECURE_COOKIES === 'true',
        sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
        maxAge: ONE_DAY_IN_MS,
      })
      .json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/sessions', async (req, res, next) => {
  try {
    const user = await UserService.signIn(req.body);
    res
      .cookie(process.env.COOKIE_NAME, user, {
        httpOnly: true,
        secure: process.env.SECURE_COOKIES === 'true',
        sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
        maxAge: ONE_DAY_IN_MS,
      })
      .json({ message: 'Signed in successfully!' });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
