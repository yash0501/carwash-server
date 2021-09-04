const express = require("express");
const bcrypt = require("bcrypt");

const car_category = require("../models/car_category");
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

const category = [
  new car_category({
    name: "car_category1",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_category({
    name: "car_category2",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_category({
    name: "car_category3",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_category({
    name: "car_category4",
    logo_image: imgUrl,
    // status: ''
  }),
  new car_category({
    name: "car_category5",
    logo_image: imgUrl,
    // status: ''
  }),
];

var done = 0;
for (var i = 0; i < category.length; i++) {
  category[i].save(function (err, result) {
    console.log(err);
    done++;
    if (done === category.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

module.exports = car_category;
