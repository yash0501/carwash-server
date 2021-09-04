const CustomErrorHandler = require("../services/CustomErrorHandler");
const models = require("../models");
const mongoose = require("mongoose");
const CustomerCars = models.CustomerCars;
const CustomerAddress = models.CustomerAddress;
const Customer = models.Customer;
const User = models.User;
const bcrypt = require("bcrypt");

const customerController = {
  async addNewCustomer(req, res, next) {
    //const session = await mongoose.startSession();

    let { name, email, contact, role } = req.body;
    let user_details;
    let customer_details;
    if (!(await User.exists({ email: email }))) {
      const user = new User({
        name,
        email,
        contact,
        role,
        password: await bcrypt.hash("12345678", 10),
      });
      user_details = await user.save();

      const customer = new Customer({
        user_id: user_details._id,
        name: name,
        email: email,
        contact: contact,
        role: role,
      });
      customer_details = await customer.save();
    }

    customer_details = await Customer.findOne({ email: email });

    let ObjId = "jhhgjadgg";
    let Addresses = [];
    for (let i = 0; i < req.body.addresses.length; i++) {
      //console.log(req.body.addresses[i]);
      let { address, address_name, locality_id, status } =
        req.body.addresses[i];
      const customer_address = new CustomerAddress({
        user_id: customer_details._id,
        address: address,
        address_name: address_name,
        locality_id: locality_id,
        status: status,
        object_id: ObjId,
        created_by: customer_details._id,
      });
      Addresses.push(customer_address);
    }
    //console.log(Addresses);
    let Cars = [];
    for (let i = 0; i < req.body.cars.length; i++) {
      //console.log(req.body.addresses[i]);
      let {
        car_id,
        color,
        registration_number,
        insurance_exp_date,
        pollution_exp_date,
        service_due_date,
        service_due_km,
        km_driven,
        tire_rotation_due_kms,
        image_path,
        status,
      } = req.body.cars[i];
      const customer_cars = new CustomerCars({
        user_id: customer_details._id,
        car_id,
        color,
        registration_number,
        insurance_exp_date,
        pollution_exp_date,
        service_due_date,
        service_due_km,
        km_driven,
        tire_rotation_due_kms,
        image_path,
        status,
        object_id: ObjId,
        created_by: customer_details._id,
      });
      Cars.push(customer_cars);
    }

    try {
      CustomerAddress.collection.insertMany(Addresses, function (err, data1) {
        if (err) {
          res.json({
            status: true,
            message: err,
            data: err,
          });
        } else {
          CustomerCars.collection.insertMany(Cars, function (err, data2) {
            if (err) {
              res.json({
                status: true,
                message: err,
                data: err,
              });
            } else {
              res.json({
                status: true,
                message: "Data saved successfully",
                data: { customer_details, data1, data2 },
              });
            }
          });
        }
      });
    } catch (e) {
      console.log(e);
    }

    //session.endSession();
    //console.log(Cars);
    /*
    const session = await mongoose.startSession();
    let result = [];

    await session.withTransaction(async () => {
      result.push(
        await CustomerAddress.insertMany(Addresses, { session: session })
      );
      result.push(await CustomerCars.insertMany(Cars, { session: session }));
      res.json({
        status: true,
        message: "Data saved successfully",
        data: { result },
      });
    });

    session.endSession();
  */
    //let error = [];
    //let response = [];

    //try {
    /*const result = await Promise.all([
        CustomerAddress.collection.insertMany(Addresses),
        CustomerCars.collection.insertMany(Cars),
      ]);
      const data = await Promise.all(result.map((r) => r.json()));
      res.json({
        status: true,
        message: "Data saved successfully",
        data: { data },
      });*/
    /*
      const result1 = await CustomerCars.collection.insertMany(Cars);
      const result2 = await CustomerAddress.collection.insertMany(Addresses);
      res.json({
        status: true,
        message: "Data saved successfully",
        data: { result1, result2 },
      });
    } catch (e) {
      res.json({
        status: false,
        message: e,
        data: { e },
      });
    }
    */
  },

  async getAllCustomers(req, res, next) {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const skip = (page - 1) * limit;
    try {
      let count = await Customer.countDocuments();
      const customers = await Customer.find({}).skip(skip).limit(limit);
      //const cars = await UserCars.find({}).skip(skip).limit(limit);
      if (!customers) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { customers, count } });
    } catch (err) {
      return next(err);
    }
  },

  async getOneCustomerDetails(req, res, next) {
    const customerId = req.params.id;
    try {
      const details1 = await Customer.findOne({ _id: customerId });
      const cars = await CustomerCars.find({ user_id: customerId });
      const addresses = await CustomerAddress.find({ user_id: customerId });
      /*const details = await Customer.aggregate([
        { $match: { email: details1.email } },
        {
          $lookup: {
            from: "customercars",
            localField: "_id",
            foreignField: "user_id",
            as: "cars",
          },
        },
        {
          $lookup: {
            from: "customeraddresses",
            localField: "_id",
            foreignField: "user_id",
            as: "addresses",
          },
        },
      ]);*/
      //console.log(details);
      if (!details1 && !cars && !addresses) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({
        status: true,
        message: "",
        data: { details1, cars, addresses },
      });
    } catch (err) {
      return next(err);
    }
  },

  async getOneCustomerCars(req, res, next) {
    const customerId = req.params.id;
    try {
      const customerCars = await CustomerCars.find({ user_id: customerId });
      if (!customerCars) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { customerCars } });
    } catch (err) {
      return next(err);
    }
  },

  async getOneCustomerAddress(req, res, next) {
    const customerId = req.params.id;
    try {
      const customerAddress = await CustomerAddress.find({
        user_id: customerId,
      });
      if (!customerAddress) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { customerAddress } });
    } catch (err) {
      return next(err);
    }
  },

  async updateCustomerDetails(req, res, next) {
    let customerId = req.params.id;
    let result = [];
    let { name, email, contact, role, user_id } = req.body;
    let details = Customer.findByIdAndUpdate(customerId, {
      name,
      email,
      contact,
      role,
    });

    let user = User.findOneAndUpdate(
      { _id: user_id },
      {
        name,
        email,
        contact,
        role,
      }
    );

    result.push(await details.exec());
    await user.exec();
    for (let i = 0; i < req.body.addresses.length; i++) {
      //console.log(req.body.addresses[i]);
      let { address, address_name, locality_id, status, object_id, user_id } =
        req.body.addresses[i];
      let customer_address;
      if (!req.body.addresses[i]._id) {
        customer_address = new CustomerAddress({
          user_id: user_id,
          address: address,
          address_name: address_name,
          locality_id: locality_id,
          status: status,
          object_id: object_id,
          updated_by: user_id,
        });
        result.push(await customer_address.save());
      } else {
        customer_address = CustomerAddress.findByIdAndUpdate(
          req.body.addresses[i]._id,
          {
            user_id: customerId,
            address: address,
            address_name: address_name,
            locality_id: locality_id,
            status: status,
            object_id: object_id,
            updated_by: user_id,
          }
        );
        result.push(await customer_address.exec());
      }
      //Addresses.push(customer_address);
    }

    for (let i = 0; i < req.body.cars.length; i++) {
      //console.log(req.body.addresses[i]);
      let {
        user_id,
        car_id,
        color,
        registration_number,
        insurance_exp_date,
        pollution_exp_date,
        service_due_date,
        service_due_km,
        km_driven,
        tire_rotation_due_kms,
        image_path,
        status,
        object_id,
      } = req.body.cars[i];
      let customer_cars;
      if (!req.body.cars[i]._id) {
        customer_cars = new CustomerCars({
          user_id: user_id,
          car_id,
          color,
          registration_number,
          insurance_exp_date,
          pollution_exp_date,
          service_due_date,
          service_due_km,
          km_driven,
          tire_rotation_due_kms,
          image_path,
          status,
          object_id: object_id,
          updated_by: user_id,
        });
        result.push(await customer_cars.save());
      } else {
        customer_cars = CustomerCars.findByIdAndUpdate(req.body.cars[i]._id, {
          user_id: user_id,
          car_id,
          color,
          registration_number,
          insurance_exp_date,
          pollution_exp_date,
          service_due_date,
          service_due_km,
          km_driven,
          tire_rotation_due_kms,
          image_path,
          status,
          object_id: object_id,
          updated_by: user_id,
        });
        result.push(await customer_cars.exec());
      }
      //Cars.push(customer_cars);
    }
    await res.json({
      status: true,
      message: "data",
      data: result,
    });
    /*try {
      CustomerAddress.updateMany(
        { user_id: customerId },
        Addresses,
        function (err, data1) {
          if (err) {
            res.json({
              status: true,
              message: err,
              data: err,
            });
          } else {
            CustomerCars.updateMany(
              { user_id: customerId },
              Cars,
              function (err, data2) {
                if (err) {
                  res.json({
                    status: true,
                    message: err,
                    data: err,
                  });
                } else {
                  res.json({
                    status: true,
                    message: "Data saved successfully",
                    data: { data1, data2 },
                  });
                }
              }
            );
          }
        }
      );
    } catch (e) {
      console.log(e);
    }*/
  },
};

module.exports = customerController;
