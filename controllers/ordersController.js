const mongoose = require("mongoose");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const models = require("../models");
const Orders = models.Orders;
const OrderItems = models.OrderItems;
const Subscription = models.Subscription;
const CustomerCars = models.CustomerCars;
const Customer = models.Customer;
const Package = models.Package;

const orderController = {
  async createOrder(req, res, next) {
    const customerId = req.body.customer_id;
    let {
      customer_car_id,
      customer_car_no,
      order_amount,
      coupon_code,
      total_discount,
      tax_amount,
      wallet_amount,
      payable_amount,
      payment_mode,
      order_status,
      payment_status,
      customer_address,
      customer_name,
      customer_contact,
    } = req.body;

    let orderItemsTypeCount = [];
    orderItemsTypeCount[0] = 0;
    orderItemsTypeCount[1] = 0;
    orderItemsTypeCount[2] = 0;
    orderItemsTypeCount[3] = 0;
    for (let i = 0; i < req.body.order_items.length; i++) {
      if (req.body.order_items[i].item_type == "product") {
        orderItemsTypeCount[0]++;
      } else if (req.body.order_items[i].item_type == "service") {
        orderItemsTypeCount[1]++;
      } else if (req.body.order_items[i].item_type == "package") {
        orderItemsTypeCount[2]++;
      } else if (req.body.order_items[i].item_type == "subscription") {
        orderItemsTypeCount[3]++;
      }
    }

    let order_type =
      "product: " +
      orderItemsTypeCount[0] +
      ", service: " +
      orderItemsTypeCount[1] +
      ", package: " +
      orderItemsTypeCount[2] +
      ", subscription: " +
      orderItemsTypeCount[3];

    let order_object_id = "hdgddhddghd";

    const order = new Orders({
      object_id: order_object_id,
      customer_id: customerId,
      customer_car_id,
      customer_car_no,
      order_type: order_type,
      order_amount,
      coupon_code,
      total_discount,
      tax_amount,
      wallet_amount,
      payable_amount,
      payment_mode,
      order_status,
      payment_status,
      customer_address,
      customer_name,
      customer_contact,
      created_by: customerId,
    });
    let order_details = await order.save();

    let all_order_items = [];
    let all_subscriptions = [];
    let updated_subscriptions = [];

    for (let j = 0; j < req.body.updateSubscriptions.length; j++) {
      const subscriptionId = req.body.updateSubscriptions[j]._id;
      let {
        object_id,
        user_id,
        user_car_id,
        subscription_type,
        date,
        item_id,
        item_name,
        quantity,
        unit_price,
        discount_per,
        tax_id,
        tax_percent,
        total_amount,
        renewal_count,
      } = req.body.updateSubscriptions[j];

      let dates = [];
      for (let i = 0; i < date.length; i++) {
        dates.push(date[i]);
      }

      renewal_count = renewal_count + 1;
      let currentDate = new Date();
      let dateAfter = new Date();
      dateAfter.setDate(dateAfter.getDate() + 30);

      let renewed_date = {
        start_date: currentDate,
        end_date: dateAfter,
        payment_date: currentDate,
        order_id: order_details._id,
      };

      dates.push(renewed_date);

      let order_item = new OrderItems({
        order_id: order_details._id,
        item_type: "subscription",
        item_id,
        item_name,
        quantity,
        unit_price,
        discount_per,
        start_date: renewed_date.start_date,
        tax_id,
        tax_percent,
        total_amount,
      });
      all_order_items.push(await order_item.save());

      let renewedSub = Subscription.findOneAndUpdate(
        { _id: subscriptionId },
        {
          object_id,
          user_id,
          user_car_id,
          item_id,
          item_name,
          quantity,
          unit_price,
          discount_per,
          tax_id,
          tax_percent,
          total_amount,
          subscription_type,
          renewal_count,
          date: dates,
          updated_by: user_id,
        }
      );
      updated_subscriptions.push(await renewedSub.exec());
    }

    for (let i = 0; i < req.body.order_items.length; i++) {
      let {
        item_type,
        item_id,
        item_name,
        quantity,
        unit_price,
        discount_per,
        tax_id,
        tax_percent,
        total_amount,
        start_date,
      } = req.body.order_items[i];
      let orderItemObjId = "dghdggffhsdgj";

      let currentDate = new Date(start_date);
      let dateAfter = new Date(start_date);
      dateAfter.setDate(dateAfter.getDate() + 30);
      let subscriptionObjId = "nggffcgcgng";

      if (item_type == "subscription") {
        let order_item = new OrderItems({
          order_id: order_details._id,
          object_id: orderItemObjId,
          item_type,
          item_id,
          item_name,
          quantity,
          unit_price,
          discount_per,
          start_date: start_date,
          tax_id,
          tax_percent,
          total_amount,
        });
        all_order_items.push(await order_item.save());

        let itemSubscription = new Subscription({
          object_id: subscriptionObjId,
          user_id: customerId,
          user_car_id: customer_car_id,
          subscription_type: item_type,
          item_id,
          item_name,
          quantity,
          unit_price,
          discount_per,
          tax_id,
          tax_percent,
          total_amount,
          date: [
            {
              start_date: currentDate,
              end_date: dateAfter,
              payment_date: currentDate,
              order_id: order_details._id,
            },
          ],
          created_by: customerId,
        });
        all_subscriptions.push(await itemSubscription.save());
      } else {
        let order_item = new OrderItems({
          order_id: order_details._id,
          item_type,
          item_id,
          item_name,
          quantity,
          unit_price,
          discount_per,
          tax_id,
          tax_percent,
          total_amount,
        });
        all_order_items.push(await order_item.save());
      }

      //console.log(new Date());
    }
    try {
      res.json({
        status: true,
        message: "Data saved successfully",
        data: {
          order_details: order_details,
          order_item_details: all_order_items,
          all_subscriptions: all_subscriptions,
          updated_subscriptions: updated_subscriptions,
        },
      });
    } catch (err) {
      res.json({
        status: true,
        message: err,
        data: err,
      });
    }
  },

  async getAllOrders(req, res, next) {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const skip = (page - 1) * limit;
    try {
      let count = await Orders.countDocuments();
      const orders = await Orders.find({}).skip(skip).limit(limit);
      if (!orders) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({ status: true, message: "", data: { orders, count } });
    } catch (err) {
      return next(err);
    }
  },

  async getOneOrderDetails(req, res, next) {
    const orderId = req.params.id;
    try {
      const oneOrder = await Orders.findOne({ _id: orderId });
      const oneOrderItems = await OrderItems.find({ order_id: orderId });
      /*const carDetails = await CustomerCars.find({
        _id: oneOrder.customer_car_id,
      });
      let itemDetails = [];
      for (let i = 0; i < oneOrderItems.length; i++) {
        itemDetails.push(await Package.find({ _id: oneOrderItems[i].item_id }));
      }*/
      if (!oneOrder) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({
        status: true,
        message: "",
        data: {
          oneOrder: oneOrder,
          order_items: oneOrderItems,
          //carDetails: carDetails,
          //itemDetails: itemDetails,
        },
      });
    } catch (err) {
      return next(err);
    }
  },

  async getSubscriptions(req, res, next) {
    let { user_id, user_car_id } = req.query;
    try {
      const subscriptions = await Subscription.find({ user_id, user_car_id });
      //const oneOrderItems = await OrderItems.find({ order_id: orderId });
      if (!subscriptions) {
        return next(CustomErrorHandler.notFound());
      }
      res.json({
        status: true,
        message: "",
        data: { subscriptions },
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateSubscriptions(req, res, next) {
    const subscriptionId = req.body._id;
    let {
      order_id,
      object_id,
      user_id,
      user_car_id,
      subscription_type,
      date,
      renewal_count,
    } = req.body;

    let dates = [];
    for (let i = 0; i < date.length; i++) {
      dates.push(date[i]);
    }

    renewal_count = renewal_count + 1;
    let currentDate = new Date();
    let dateAfter = new Date();
    dateAfter.setDate(dateAfter.getDate() + 30);

    let renewed_date = {
      start_date: currentDate,
      end_date: dateAfter,
      payment_date: currentDate,
      order_id: order_details._id,
    };

    /*object_id: subscriptionObjId,
          user_id: customerId,
          user_car_id: customer_car_id,
          subscription_type: item_type,
          date: [
            {
              start_date: currentDate,
              end_date: dateAfter,
              payment_date: currentDate,
              order_id: order_details._id,
            },
          ],
          created_by: customerId,*/
  },

  async updateOrder(req, res, next) {
    const orderId = req.params.id;
    let {
      customer_id,
      customer_car_id,
      customer_car_no,
      object_id,
      order_type,
      order_amount,
      coupon_code,
      total_discount,
      tax_amount,
      wallet_amount,
      payable_amount,
      payment_mode,
      order_status,
      payment_status,
      customer_address,
      customer_name,
      customer_contact,
    } = req.body;
    const updateOrder = Orders.findByIdAndUpdate(orderId, {
      customer_id,
      customer_car_id,
      customer_car_no,
      object_id: object_id,
      order_type,
      order_amount,
      coupon_code,
      total_discount,
      tax_amount,
      wallet_amount,
      payable_amount,
      payment_mode,
      order_status,
      payment_status,
      customer_address,
      customer_name,
      customer_contact,
      updated_by: customer_id,
    });
    const orderDetails = await updateOrder.exec();

    let orderItemsResult = [];

    for (let i = 0; i < req.body.order_items.length; i++) {
      let {
        item_type,
        item_id,
        item_name,
        quantity,
        unit_price,
        discount_per,
        tax_id,
        tax_percent,
        total_amount,
      } = req.body.order_items[i];
      let orderItem;
      if (!req.body.order_items[i]._id) {
        orderItem = new OrderItems({
          order_id: orderId,
          item_type,
          item_id,
          item_name,
          quantity,
          unit_price,
          discount_per,
          tax_id,
          tax_percent,
          total_amount,
        });
        orderItemsResult.push(await orderItem.save());
      } else {
        orderItem = OrderItems.findByIdAndUpdate(req.body.order_items[i]._id, {
          item_type,
          item_id,
          item_name,
          quantity,
          unit_price,
          discount_per,
          tax_id,
          tax_amount,
          total_amount,
        });
        orderItemsResult.push(await orderItem.exec());
      }
    }
    await res.json({
      status: true,
      message: "data",
      data: {
        orderDetails: orderDetails,
        orderItems: orderItemsResult,
      },
    });
  },
};

module.exports = orderController;
