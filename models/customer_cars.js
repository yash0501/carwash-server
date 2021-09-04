const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerCarsSchema = new Schema(
  {
    user_id: { type: String },
    object_id: { type: String },
    car_id: { type: String },
    car_type: { type: String },
    color: { type: String },
    registration_number: { type: String },
    insurance_exp_date: { type: String },
    pollution_exp_date: { type: String },
    service_due_date: { type: String },
    service_due_km: { type: String },
    km_driven: { type: String },
    tire_rotation_due_kms: { type: String },
    image_path: { type: String },
    status: { type: String },
    created_by: { type: String },
    updated_by: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerCars", customerCarsSchema);
