const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
    contact: { type: Number, required: true },
    address: { type: String },
    resetLink: { data: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
