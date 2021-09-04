// export { default as registerController } from './auth/registerController';
// export { default as loginController } from './auth/loginController';
const authController = require("./auth/authController");
const userController = require("./auth/userController");
const refreshController = require("./auth/refreshController");
const getAlluserController = require("./getAlluserController");
const serviceItemController = require("./serviceItemController");
const packageController = require("./packagesController");
const CarController = require("./getAllCarsController");
const localitiesController = require("./localitiesController");
const customerController = require("./customerController");
const orderController = require("./ordersController");
const searchController = require("./allsearch");
// export { default as userController } from "./auth/userController";
// export { default as refreshController } from "./auth/refreshController";
// export { default as getAlluserController } from "./getAlluserController";
// export { default as authController } from "./auth/authController";
// export { default as serviceItemController } from "./serviceItemController";
module.exports = {
  authController,
  userController,
  refreshController,
  getAlluserController,
  serviceItemController,
  packageController,
  CarController,
  localitiesController,
  customerController,
  orderController,
  searchController,
};
