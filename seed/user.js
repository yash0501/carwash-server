const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");
const config = require("../config");
const DB_URL = config.DB_URL;
console.log(config);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const user = [
  new User({
    name: "user1",
    email: "saurabhrana1@gmail.com",
    password: "$2b$05$562VZwZpCNCCqMmS7YeJN.dv2WI6x3qvoBlBChgD4OwJt234hBznG",
  }),
  new User({
    name: "user2",
    email: "saurabhrana2@gmail.com",
    password: "$2b$05$562VZwZpCNCCqMmS7YeJN.dv2WI6x3qvoBlBChgD4OwJt234hBznG",
  }),
  new User({
    name: "user3",
    email: "saurabhrana3@gmail.com",
    password: "$2b$05$562VZwZpCNCCqMmS7YeJN.dv2WI6x3qvoBlBChgD4OwJt234hBznG",
  }),
  new User({
    name: "user3",
    email: "saurabhrana4@gmail.com",
    password: "$2b$05$562VZwZpCNCCqMmS7YeJN.dv2WI6x3qvoBlBChgD4OwJt234hBznG",
  }),
  new User({
    name: "user5",
    email: "saurabhrana5@gmail.com",
    password: "$2b$05$562VZwZpCNCCqMmS7YeJN.dv2WI6x3qvoBlBChgD4OwJt234hBznG",
  }),
];

var done = 0;
for (var i = 0; i < user.length; i++) {
  user[i].save(function (err, result) {
    done++;
    if (done === user.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

module.exports = user;
