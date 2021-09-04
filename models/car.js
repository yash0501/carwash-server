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
//console.log(config);

const CarSchema = new Schema(
  {
    name: { type: String, required: true },

    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car_brands",
      required: true,
    },

    model_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car_model",
      required: true,
    },

    fuel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car_Fuel ",
      required: true,
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car_category ",
      required: true,
    },
    VarientName: { type: String, required: true },

    status: {
      type: String,
      enum: ["NEW", "STATUS"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;
