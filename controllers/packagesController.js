const CustomErrorHandler = require("../services/CustomErrorHandler");
const Joi = require("joi");
const models = require("../models");
const Package = models.Package;

const packageController = {
  async addPackage(req, res, next) {
    let name1 = req.body.name;
    try {
      const exist = await Package.exists({ name: name1.trim() });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist(
            "Packages already exist in db with this name."
          )
        );
      }
    } catch (err) {
      return next(err);
    }

    const { name, package_type, description, valid_for, status } = req.body;
    const object_id = "dhhfhgfjsdbjfk";
    let Items = [];
    for (let i = 0; i < req.body.items.length; i++) {
      Items.push(req.body.items[i]);
    }
    let Prices = [];
    for (let i = 0; i < req.body.prices.length; i++) {
      Prices.push(req.body.prices[i]);
    }

    const package = new Package({
      name,
      object_id,
      package_type,
      description,
      valid_for,
      status,
      items: Items,
      prices: Prices,
    });

    try {
      const result = await package.save();
      console.log(result);
      res.json({
        status: true,
        message: "Data saved successfully",
        data: result,
      });
    } catch (err) {
      res.json({
        status: true,
        message: err,
        data: [],
      });
      return next(err);
    }
  },

  async getAllPackages(req, res, next) {
    //console.log(parseInt(req.query.page));
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const skip = (page - 1) * limit;
    try {
      let count = await Package.countDocuments();
      const packages = await Package.find({}).skip(skip).limit(limit);
      if (!packages) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { packages, count } });
    } catch (err) {
      return next(err);
    }
  },

  async getOnePackage(req, res, next) {
    const packageId = req.params.id;
    try {
      const onePackage = await Package.findOne({ _id: packageId });
      if (!onePackage) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { onePackage } });
    } catch (err) {
      return next(err);
    }
  },

  async updateOnePackage(req, res, next) {
    const updatePackageId = req.params.id;
    let { name, package_type, description, valid_for, status } = req.body;
    let name1 = req.body.name;
    name = name1.trim();
    let Items = [];
    for (let i = 0; i < req.body.items.length; i++) {
      Items.push(req.body.items[i]);
    }
    let Prices = [];
    for (let i = 0; i < req.body.prices.length; i++) {
      Prices.push(req.body.prices[i]);
    }
    try {
      let exist = await Package.findOne({ name: name });
      console.log(exist);
      if (exist._id != updatePackageId) {
        return next(
          CustomErrorHandler.alreadyExist(
            "This Service-Item with this name already exist in db."
          )
        );
      }
    } catch (err) {
      return next(err);
    }
    Package.findByIdAndUpdate(
      updatePackageId,
      {
        name,
        package_type,
        description,
        valid_for,
        status,
        items: Items,
        prices: Prices,
      },
      function (err, data) {
        if (err) {
          throw err;
        }
        return res.json({
          status: true,
          message: "updated Item",
          data: data,
        });
      }
    );
  },

  async deleteOnePackage(req, res, next) {
    let deletePackageId = req.params.id;
    Package.findOneAndRemove({ _id: deletePackageId }, function (err, data) {
      if (err) throw err;
      return res.json({
        status: true,
        message: "Delete Package",
        data: data,
      });
    });
  },
};

module.exports = packageController;
