const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.getById(req.params.id);

    if (!user || user.id !== req.user.id) {
      throw new Error('No permission to access');
    }
    next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
