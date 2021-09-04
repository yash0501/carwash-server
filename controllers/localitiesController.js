const CustomErrorHandler = require("../services/CustomErrorHandler");
const Joi = require("joi");
const models = require("../models");
const Localities = models.Localities;

const localitiesController = {
  async addLocality(req, res, next) {
    let name1 = req.body.name;
    try {
      const exist = await Localities.exists({ name: name1.trim() });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist(
            "Locality already exist in db with this name."
          )
        );
      }
    } catch (err) {
      return next(err);
    }
    const {
      name,
      address,
      status,
      locality_type,
      lat_long,
      state,
      pincode,
      city,
      total_no_of_parkings,
    } = req.body;
    const object_id = "hgjgdjgsjdfd";
    let Parkings = [];
    for (let i = 0; i < req.body.parkings.length; i++) {
      Parkings.push(req.body.parkings[i]);
    }
    const localities = new Localities({
      name,
      address,
      status,
      locality_type,
      lat_long,
      state,
      pincode,
      city,
      object_id,
      total_no_of_parkings,
      parkings: Parkings,
    });
    try {
      const result = await localities.save();
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
    }
  },

  async getAllLocalities(req, res, next) {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const skip = (page - 1) * limit;
    try {
      let count = await Localities.countDocuments();
      const localities = await Localities.find({}).skip(skip).limit(limit);
      if (!localities) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { localities, count } });
    } catch (err) {
      return next(err);
    }
  },

  async getOneLocality(req, res, next) {
    const localityId = req.params.id;
    try {
      const oneLocality = await Localities.findOne({ _id: localityId });
      if (!oneLocality) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { oneLocality } });
    } catch (err) {
      return next(err);
    }
  },

  async updateOneLocality(req, res, next) {
    const updateLocalityId = req.params.id;
    let {
      name,
      address,
      status,
      locality_type,
      lat_long,
      state,
      pincode,
      city,
      total_no_of_parkings,
    } = req.body;
    let name1 = req.body.name;
    name = name1.trim();
    let Parkings = [];
    for (let i = 0; i < req.body.parkings.length; i++) {
      Parkings.push(req.body.parkings[i]);
    }
    try {
      let exist = await Localities.findOne({ name: name });
      if (exist._id != updateLocalityId) {
        return next(
          CustomErrorHandler.alreadyExist(
            "This Locality with this name already exist in db."
          )
        );
      }
    } catch (err) {
      return next(err);
    }
    Localities.findByIdAndUpdate(
      updateLocalityId,
      {
        name,
        address,
        status,
        locality_type,
        lat_long,
        state,
        pincode,
        city,
        total_no_of_parkings,
        parkings: Parkings,
      },
      function (err, data) {
        if (err) {
          throw err;
        }
        return res.json({
          status: true,
          message: "updated Locality",
          data: data,
        });
      }
    );
  },

  async deleteLocality(req, res, next) {
    let deleteLocalityId = req.params.id;
    Localities.findOneAndRemove(
      { _id: deleteLocalityId },
      function (err, data) {
        if (err) throw err;
        return res.json({
          status: true,
          message: "Deleted Locality",
          data: data,
        });
      }
    );
  },
};

module.exports = localitiesController;
