const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  name: { type: String, required: true },
  object_id: { type: String, required: true },
  package_type: {
    type: String,
    enum: ["one_time", "subscription"],
    required: true,
  },
  status: { type: String, required: true },
  valid_for: { type: String },
  description: { type: String, required: true },
  items: [
    {
      item_name: { type: String, required: true },
      //item_id: { type: String, required: true },
      item_qty: { type: String, required: true },
    },
  ],
  prices: [
    {
      car_type: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Package", packageSchema, "packages");
