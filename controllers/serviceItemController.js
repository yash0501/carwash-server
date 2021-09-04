const CustomErrorHandler = require("../services/CustomErrorHandler");
const Joi = require("joi");
const models = require("../models");
const ServiceItem = models.ServiceItem;
const JwtService = require("../services/JwtService");
const config = require("../config");
const REFRESH_SECRET = config.REFRESH_SECRET;
const RESET_PASSWORD_KEY = config.RESET_PASSWORD_KEY;
const APP_URL = config.APP_URL;
const logger = require("../logger");

const serviceItemController = {
  /** Add item/service */

  async addItem(req, res, next) {
    logger.log(
      "info",
      `ServiceItem POST Request. Request Body = ${JSON.stringify(req.body)}`
    );
    console.log(JSON.stringify(req.body));
    let name1 = req.body.name;
    try {
      const exist = await ServiceItem.exists({ name: name1.trim() });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist(
            "This Service-Item already exist in db."
          )
        );
      }
    } catch (err) {
      logger.log("error", `ServiceItem POST Request. Error = ${err}`);
      return next(err);
    }
    const { name, status, type, description } = req.body;
    let object_id = "hgfgdtdgdfj";
    const serviceitem = new ServiceItem({
      name: name1,
      status,
      type,
      description,
      object_id,
    });
    try {
      const result = await serviceitem.save();
      logger.log(
        "info",
        `ServiceItem POST Request Successful. res.json = ${result}`
      );
      res.json({
        status: true,
        message: "Item ADD Successfully",
        data: result,
      });
    } catch (err) {
      logger.log("error", `ServiceItem POST Request. error = ${err}`);
      res.json({
        status: false,
        message: "Item Add Failed",
        data: err,
      });
      return next(err);
    }
  },

  /** Get all service/items */

  async getAllItems(req, res, next) {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const skip = (page - 1) * limit;
    try {
      let count = await ServiceItem.countDocuments();
      const Items = await ServiceItem.find({}).skip(skip).limit(limit);
      if (!Items) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { Items, count } });
    } catch (err) {
      return next(err);
    }
  },

  /** Get item/service of specific id passed in url param */

  async getItem(req, res, next) {
    let itemId = req.params.id;
    try {
      const Items = await ServiceItem.findOne({ _id: itemId });
      if (!Items) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { Items } });
    } catch (err) {
      return next(err);
    }
  },

  /** Update item/service with a specific id passed in req param */

  async updateItem(req, res, next) {
    let itemId = req.params.id;
    let { name, status, type, description } = req.body;
    let name1 = req.body.name;
    name = name1.trim();
    try {
      let exist = await ServiceItem.findOne({ name: name });
      if (exist._id != itemId) {
        return next(
          CustomErrorHandler.alreadyExist(
            "This Service-Item with this name already exist in db."
          )
        );
      }
    } catch (err) {
      return next(err);
    }
    let updateit = ServiceItem.findByIdAndUpdate(itemId, {
      name,
      status,
      type,
      description,
    });
    updateit.exec(function (err, data) {
      if (err) throw err;
      return res.json({
        status: true,
        message: "updated Item",
        data: data,
      });
    });
  },

  /** delete a item/service with specific i */

  async deleteItem(req, res) {
    let itemId = req.params.id;
    ServiceItem.findOneAndRemove({ _id: itemId }, function (err, data) {
      if (err) throw err;
      return res.json({
        status: true,
        message: "Delete Service-Item",
        data: data,
      });
    });
  },
};

module.exports = serviceItemController;
