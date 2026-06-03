const ApiError = require('../utils/ApiError');

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authorized'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Access denied. Insufficient permissions.'));
  }

  next();
};

module.exports = authorize;
