const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const localitiesSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
  locality_type: {
    type: String,
    enum: ["society", "complex"],
    required: true,
  },
  object_id: { type: String, required: true },
  lat_long: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  total_no_of_parkings: { type: String, required: true },
  parkings: [
    {
      area_name: { type: String, required: true },
      description: { type: String, required: true },
      no_of_parking: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Localities", localitiesSchema);
