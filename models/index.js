const User = require("./user");
const RefreshToken = require("./refreshToken");
const Package = require("./packages");
const ServiceItem = require("./service_item");
const Car = require("./car");
const Localities = require("./localities");
const CustomerAddress = require("./customer_address");
const CustomerCars = require("./customer_cars");
const Customer = require("./customer");
const Orders = require("./orders");
const OrderItems = require("./order_items");
const Subscription = require("./subscriptions");

// export { default as User } from "./user";
// export { default as RefreshToken } from "./refreshToken";
// export { default as ServiceItem } from "./service_item";
// export { default as Package } from "./packages";
module.exports = {
  User,
  RefreshToken,
  ServiceItem,
  Package,
  Car,
  Localities,
  CustomerAddress,
  CustomerCars,
  Customer,
  OrderItems,
  Orders,
  Subscription,
};
