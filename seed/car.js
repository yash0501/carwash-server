const express = require("express");
const bcrypt = require("bcrypt");
const car = require("../models/car");
const mongoose = require("mongoose");
const config = require("../config");
const DB_URL = config.DB_URL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const Cars = [
  new car({
    name: "car1",
    brand_id: "607424d1e2c144355c81a542",
    model_id: "607420fef923d01b2cd94761",
    fuel_id: "607423b4536ca320e807a516",
    category_id: "607424d1e2c144355c81a542",
    VarientName: "vname",
    // status: ''
  }),
  new car({
    name: "car2",
    brand_id: "607424d1e2c144355c81a543",
    model_id: "607420fef923d01b2cd94762",
    fuel_id: "607423b4536ca320e807a517",
    category_id: "607424d1e2c144355c81a543",
    VarientName: "vname",
    // status: ''
  }),
  new car({
    name: "car3",
    brand_id: "607424d1e2c144355c81a544",
    model_id: "607420fef923d01b2cd94763",
    fuel_id: "607423b4536ca320e807a518",
    category_id: "607424d1e2c144355c81a544",
    VarientName: "vname",
    // status: ''
  }),
  new car({
    name: "car3",
    brand_id: "607424d1e2c144355c81a545",
    model_id: "607420fef923d01b2cd94764",
    fuel_id: "607423b4536ca320e807a519",
    category_id: "607424d1e2c144355c81a545",
    VarientName: "vname",
    // status: ''
  }),
  new car({
    name: "car5",
    brand_id: "category_id:607424d1e2c144355c81a546",
    model_id: "607420fef923d01b2cd94765",
    fuel_id: "607423b4536ca320e807a51a",
    category_id: "607424d1e2c144355c81a546",
    VarientName: "vname",
    // status: ''
  }),
];

var done = 0;
for (var i = 0; i < Cars.length; i++) {
  Cars[i].save(function (err, result) {
    console.log(err);
    done++;
    if (done === Cars.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

module.exports = car;
