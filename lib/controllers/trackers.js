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

router.get('/', authenticate, async (req, res, next) => {
  try {
    const items = await Tracker.getAll(req.user.id);
    res.json(items);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const item = await Tracker.getById(req.params.id);
    res.json(item);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const item = await Tracker.updateById(req.params.id, req.body);
    res.json(item);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
