const express = require("express");
const bcrypt = require("bcrypt");
const car_fuel = require("../models/car_fuel");
const mongoose = require("mongoose");
const config = require("../config");
const DB_URL = config.DB_URL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const imgUrl =
  "https://lh3.googleusercontent.com/iKHbqfOA22cBvWvdnGoi165ZxDy6lqWHDIrmDGORZU0NvNX_CgnexW8OgKmDVd5sQongQwCwsqsnu3SJCCPySlozJFYnJRE=s600";

const fuels = [
  new car_fuel({
    name: "car_fuel1",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_fuel({
    name: "car_fuel2",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_fuel({
    name: "car_fuel3",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_fuel({
    name: "car_fuel3",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_fuel({
    name: "user5",
    logo_image: imgUrl,
    // status: ''
  }),
];

var done = 0;
for (var i = 0; i < fuels.length; i++) {
  fuels[i].save(function (err, result) {
    console.log(err);
    done++;
    if (done === fuels.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

module.exports = car_fuel;
