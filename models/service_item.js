const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceItemSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    object_id: { type: String, required: true },
    created_by: { type: String },
    updated_by: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ServiceItem",
  serviceItemSchema,
  "service_items"
);
