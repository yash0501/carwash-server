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

const car_categorySchema = new Schema(
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

const car_category = mongoose.model("car_category", car_categorySchema);
module.exports = car_category;
