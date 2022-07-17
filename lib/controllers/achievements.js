const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Achievement = require('../models/Achievement');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
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
  })
  .get('/week', authenticate, async (req, res, next) => {
    try {
      const { year, week } = req.query;
      const achievements = await Achievement.getByWeek(req.user.id, year, week);
      res.json(achievements);
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .put('/week', authenticate, async (req, res, next) => {
    try {
      const { year, week } = req.query;
      const achievements = await Achievement.updateByWeek(
        req.user.id,
        year,
        week,
        req.body
      );
      res.json(achievements);
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .get('/sums', authenticate, async (req, res, next) => {
    try {
      const achievementSum = await Achievement.sumAchievements(req.user.id);
      res.json(achievementSum);
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const allWeeks = await Achievement.getAllWeeks(req.user.id);
      res.json(allWeeks);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
