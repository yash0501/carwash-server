//import dotenv from "dotenv";
const dotenv = require("dotenv");
dotenv.config();

const {
  APP_PORT,
  DEBUG_MODE,
  DB_URL,
  JWT_SECRET,
  REFRESH_SECRET,
  APP_URL,
  RESET_PASSWORD_KEY,
} = process.env;

module.exports = {
  APP_PORT,
  DEBUG_MODE,
  DB_URL,
  JWT_SECRET,
  REFRESH_SECRET,
  APP_URL,
  RESET_PASSWORD_KEY,
};
