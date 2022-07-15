const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Achievement = require('../models/Achievement');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const achievement = await Achievement.insert({
      userId: req.user.id,
      ...req.body,
    });
    res.json(achievement);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
