const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    object_id: { type: String },
    customer_id: { type: String },
    customer_car_id: { type: String },
    customer_car_no: { type: String },
    order_type: { type: String },
    order_amount: { type: Number },
    coupon_code: { type: String },
    total_discount: { type: Number },
    tax_amount: { type: Number },
    wallet_amount: { type: Number },
    payable_amount: { type: Number },
    payment_mode: { type: String, enum: ["cod", "online"] },
    order_status: { type: String },
    payment_status: { type: String },
    customer_address: { type: String },
    customer_name: { type: String },
    customer_contact: { type: Number },
    created_by: { type: String },
    updated_by: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
