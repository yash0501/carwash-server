const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemsSchema = new Schema({
  order_id: { type: String, required: true },
  item_type: { type: String },
  item_id: { type: String },
  item_name: { type: String },
  start_date: { type: String },
  quantity: { type: Number },
  unit_price: { type: Number },
  discount_per: { type: Number },
  tax_id: { type: String },
  tax_percent: { type: Number },
  total_amount: { type: Number },
});

module.exports = mongoose.model("OrderItems", orderItemsSchema);
