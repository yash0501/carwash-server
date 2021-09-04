const models = require("../models");
const bcrypt = require("bcrypt");
const User = models.User;
const CustomErrorHandler = require("../services/CustomErrorHandler");

const getAlluserController = {
  async get(req, res, next) {
    console.log(req.headers.authorization);
    try {
      const user = await User.find();
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (err) {
      return next(err);
    }
  },
  async getone(req, res, next) {
    var userid = req.params.id;
    try {
      const user = await User.findById(userid);
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (err) {
      return next(err);
    }
  },
  async update(req, res) {
    var userid = req.params.id;
    let { name, email, password, contact, address } = req.body;
    let pass = req.body.password;
    password = await bcrypt.hash(pass, 10);

    var updateuser = User.findByIdAndUpdate(userid, {
      name,
      email,
      password,
      contact,
      address,
    });
    updateuser.exec(function (err, data) {
      if (err) throw err;
      return res.json({
        status: true,
        message: "update User",
        data: {
          name,
          email,
          password,
          contact,
          address,
        },
      });
    });
  },
  async destroy(req, res) {
    var userid = req.params.id;
    User.findOneAndRemove({ _id: userid }, function (err, data) {
      if (err) throw err;
      return res.json({
        status: true,
        message: "Delete User",
        data: data,
      });
    });
  },
};

module.exports = getAlluserController;
