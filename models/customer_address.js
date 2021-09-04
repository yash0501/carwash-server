const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerAddressSchema = new Schema(
  {
    user_id: { type: String },
    object_id: { type: String },
    address: { type: String },
    address_name: { type: String },
    locality_id: { type: String },
    status: { type: String },
    created_by: { type: String },
    updated_by: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerAddress", customerAddressSchema);
