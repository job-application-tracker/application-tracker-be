const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Tracker = require('../models/Tracker');

const router = Router();

router.post('/', authenticate, async (req, res, next) => {
  try {
    const tracker = await Tracker.insert({ userId: req.user.id, ...req.body });
    res.json(tracker);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
