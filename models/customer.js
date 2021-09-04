const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    user_id: {type: String},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "customer" },
    contact: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema, "customers");
