const mongoose = require("mongoose");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const models = require("../models");
const Orders = models.Orders;
const OrderItems = models.OrderItems;
const Subscription = models.Subscription;
const CustomerCars = models.CustomerCars;
const Customer = models.Customer;
const Package = models.Package;
const ServiceItem = models.ServiceItem;
const Localities = models.Localities;

const searchController = {
  async orderType(req, res, next) {
    const type = req.query.type;
    const name = req.query.name;
    let data;
    try {
      if (type == "item" || type == "service") {
        data = await ServiceItem.find({
          name: { $regex: name, $options: "$i" },
          type: { $regex: type, $options: "$i" },
        });
      } else if (type == "one_time" || type == "subscription") {
        data = await Package.find({
          name: { $regex: name, $options: "$i" },
          package_type: { $regex: type, $options: "$i" },
        });
      }
      if (!data) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { data } });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = searchController;
