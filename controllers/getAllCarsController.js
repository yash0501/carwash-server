const models = require("../models");
const Car = models.Car;

const CarController = {
  async getAllCars(req, res, next) {
    try {
      const cars = await Car.find();
      if (!cars) {
        console.log("Cars not found 404");
      }
      res.json({ status: true, message: "", data: { cars } });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = CarController;
