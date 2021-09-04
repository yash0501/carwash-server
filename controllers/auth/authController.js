const Joi = require("joi");
const models = require("../../models");
const User = models.User;
const Customer = models.Customer;
const RefreshToken = models.RefreshToken;
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const JwtService = require("../../services/JwtService");
const config = require("../../config");
const REFRESH_SECRET = config.REFRESH_SECRET;
const RESET_PASSWORD_KEY = config.RESET_PASSWORD_KEY;
const APP_URL = config.APP_URL;
const nodemailer = require("nodemailer");
const _ = require("lodash");

const authController = {
  // login authtication **************************************************************************************

  async login(req, res, next) {
    // Validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      // compare the password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // // Toekn
      // const access_token = JwtService.sign({ _id: user._id, role: user.role });
      // const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
      // Toekn
      const access_token = JwtService.sign({ _id: user._id });
      const refresh_token = JwtService.sign(
        { _id: user._id },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({
        status: true,
        message: "",
        data: [{ access_token, refresh_token, user }],
      });
    } catch (err) {
      return next(err);
    }
  },

  async logout(req, res, next) {
    // validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong in the database"));
    }
    res.json({ status: 1 });
  },

  //registe function ******************************************************************************************************

  async register(req, res, next) {
    // Validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
      contact: Joi.number().integer().required(),
      address: Joi.string().required(),
      role: Joi.string().required(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // check if user is in the database already
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken.")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, password, contact, address, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // prepare the model

    const user = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      address,
      role,
    });

    let access_token;
    let refresh_token;
    try {
      const result = await user.save();
      console.log(result);

      const customer = new Customer({
        user_id: result._id,
        name,
        email,
        role,
        contact,
      });

      const customer_details = await customer.save();

      // Token
      // access_token = JwtService.sign({ _id: result._id, role: result.role });
      // refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);

      access_token = JwtService.sign({ _id: result._id });
      refresh_token = JwtService.sign(
        { _id: result._id },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }

    res.json({
      status: true,
      message: "",
      data: [{ access_token, refresh_token }],
    });
  },

  //********************************************************************************************************************** */

  async refresh(req, res, next) {
    // validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // database
    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
      }

      let userId;
      try {
        const { _id } = await JwtService.verify(
          refreshtoken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (err) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
      }

      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized("No user found!"));
      }

      // tokens
      // // Toekn
      // const access_token = JwtService.sign({ _id: user._id, role: user.role });
      // const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
      // Toekn
      const access_token = JwtService.sign({ _id: user._id });
      const refresh_token = JwtService.sign(
        { _id: user._id },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong " + err.message));
    }
  },

  // get login user*********************************************************************************************************

  async me(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (err) {
      return next(err);
    }
  },

  /** Forget Password */

  forgetPassword(req, res, next) {
    let email1 = req.body.email;
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: "User with this email does not exist." });
      }

      const forgetToken = JwtService.sign(
        { _id: user._id },
        60 * 15,
        RESET_PASSWORD_KEY
      );

      console.log(forgetToken);

      nodemailer.createTestAccount((err, account) => {
        if (err) {
          console.error("Failed to create a testing account. " + err.message);
          return process.exit(1);
        }
        console.log("Credentials obtained, sending message...");

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        console.log(account);

        // Message object
        let message = {
          from: "Sender Name <sender@example.com>",
          to: email1,
          subject: "Reset Password for CarNehlao",
          html: `<h2>Please Click on this link to reset your Password. This link will be valid for 15 min only.
          <a href="${APP_URL}/reset-password/${forgetToken}">Reset Password</a>`,
        };

        return user.updateOne({ resetLink: forgetToken }, (err, success) => {
          if (err) {
            return res.status(400).json({ error: "Reset Password link error" });
          } else {
            transporter.sendMail(message, (err, info) => {
              if (err) {
                console.log("Error occurred. " + err.message);
                return res.json({
                  error: err.message,
                });
              }

              console.log("Message sent: %s", info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(info)
              );
              return res.json({ message: "Email has been sent" });
            });
          }
        });
      });
    });
  },

  /** Reset Password */

  resetPassword(req, res, next) {
    const { resetLink, newPass } = req.body;
    console.log(RESET_PASSWORD_KEY);
    if (resetLink) {
      JwtService.verify(
        resetLink,
        RESET_PASSWORD_KEY,
        function (error, decodeData) {
          console.log(decodeData);
          if (error) {
            return res
              .status(401)
              .json({ error: "Incorrect token or token expired" });
          }
          User.findOne({ resetLink }, (err, user) => {
            if (err || !user) {
              return res.status(400).json({
                error:
                  "User with this token does not exist ot the password was already reset.",
              });
            }
            const obj = {
              password: newPass,
              resetLink: "",
            };
            user = _.extend(user, obj);
            user.save((err, result) => {
              if (err) {
                return res.status(400).json({ error: "Reset Password Error" });
              } else {
                return res
                  .status(200)
                  .json({ message: "Your password has been changed." });
              }
            });
          });
        }
      );
    } else {
      return res.status(401).json({ error: "Authentication Error" });
    }
  },
};

module.exports = authController;
