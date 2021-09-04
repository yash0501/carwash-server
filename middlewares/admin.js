const models = require("../models");
const User = models.User;
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user.role === "customer") {
      next();
    } else {
      return next(CustomErrorHandler.unAuthorized());
    }
  } catch (err) {
    return next(CustomErrorHandler.serverError());
  }
};

module.exports = admin;
