const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionsSchema = new Schema(
  {
    object_id: { type: String },
    user_id: { type: String },
    user_car_id: { type: String },
    item_id: { type: String },
    item_name: { type: String },
    quantity: { type: Number },
    unit_price: { type: Number },
    discount_per: { type: Number },
    tax_id: { type: String },
    tax_percent: { type: Number },
    total_amount: { type: Number },
    //subscription_id: { type: String, required: true },
    renewal_count: { type: Number, default: 0 },
    subscription_type: { type: String },
    date: [
      {
        start_date: { type: String },
        end_date: { type: String },
        payment_date: { type: String },
        order_id: { type: String },
      },
    ],
    created_by: { type: String },
    updated_by: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionsSchema);
