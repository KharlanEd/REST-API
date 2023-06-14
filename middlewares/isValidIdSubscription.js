const { schemas } = require("../models/user");

const { HttpError } = require("../helpers");

const isValidIdSubscription = (req, res, next) => {
  const { subscription } = req.params;

  const { error } = schemas.subscriptionSchema.validate(subscription);

  if (error) {
    next(HttpError(400, error.message));
  }
  next();
};

module.exports = isValidIdSubscription;