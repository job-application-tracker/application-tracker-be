const { Router } = require('express');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    res.send({});
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
