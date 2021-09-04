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

const car_fuelSchema = new Schema(
  {
    name: { type: String, required: true },
    logo_image: { data: Buffer, contentType: String },
    status: {
      type: String,
      enum: ["NEW", "STATUS"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

const car_fuel = mongoose.model(" car_fuel", car_fuelSchema);
module.exports = car_fuel;
