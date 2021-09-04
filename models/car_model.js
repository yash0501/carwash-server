const mongoose = require("mongoose");
/*const config = require("../config");
const DB_URL = config.DB_URL;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});*/
const Schema = mongoose.Schema;

//console.log("car model schema");

const car_modelSchema = new Schema(
  {
    name: { type: String, required: true },
    logo_image: { type: String, required: true },
    status: {
      type: String,
      enum: ["NEW", "STATUS"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

const car_model = mongoose.model(" car_model", car_modelSchema);
module.exports = car_model;
