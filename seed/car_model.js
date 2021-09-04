const express = require("express");
const bcrypt = require("bcrypt");
const car_model = require("../models/car_model");
const mongoose = require("mongoose");
const config = require("../config");
const DB_URL = config.DB_URL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

console.log("Hello World");

const imgUrl =
  "https://lh3.googleusercontent.com/iKHbqfOA22cBvWvdnGoi165ZxDy6lqWHDIrmDGORZU0NvNX_CgnexW8OgKmDVd5sQongQwCwsqsnu3SJCCPySlozJFYnJRE=s600";

const cars = [
  new car_model({
    name: "car_model1",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_model({
    name: "car_model2",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_model({
    name: "car_model3",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_model({
    name: "car_model3",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_model({
    name: "user5",
    logo_image: imgUrl,
    // status: ''
  }),
];

var done = 0;
for (var i = 0; i < cars.length; i++) {
  cars[i].save(function (err, result) {
    console.log(err);
    done++;
    if (done === cars.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

module.exports = car_model;
