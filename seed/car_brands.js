const express = require("express");
const bcrypt = require("bcrypt");
const car_brands = require("../models/car_brands");
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

const brands = [
  new car_brands({
    name: "car_brands1",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_brands({
    name: "car_brands2",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_brands({
    name: "car_brands3",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_brands({
    name: "car_brands3",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_brands({
    name: "user5",
    logo_image: imgUrl,
    // status: ''
  }),
];

var done = 0;
for (var i = 0; i < brands.length; i++) {
  brands[i].save(function (err, result) {
    console.log(err);
    done++;
    if (done === brands.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

module.exports = car_brands;
