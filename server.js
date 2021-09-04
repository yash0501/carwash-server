const express = require("express");
const config = require("./config");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const cors = require("cors");
const routes = require("./routes/");
const mongoose = require("mongoose");
const logger = require("./logger");
const path = require("path");
const DB_URL = config.DB_URL;
const APP_PORT = config.APP_PORT;
logger.log("info", "DB_URL");
logger.log("info", DB_URL);
logger.log("info", "APP_PORT");
logger.log("info", APP_PORT);
// Database connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", logger.error.bind(console, "connection error:"));
db.once("open", () => {
  logger.log("info", "DB connected...");
});

global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.use(errorHandler);
app.listen(APP_PORT, () => console.log("app listing on 3000"));
