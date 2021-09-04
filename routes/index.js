const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const auth = require("../middlewares/auth");

// import admin from '../middlewares/admin';
const authController = controller.authController;
const getAlluserController = controller.getAlluserController;
const serviceItemController = controller.serviceItemController;
const packageController = controller.packageController;
const CarController = controller.CarController;
const localitiesController = controller.localitiesController;
const customerController = controller.customerController;
const orderController = controller.orderController;
const searchController = controller.searchController;

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth, authController.me);
router.post("/refresh", authController.refresh);
router.post("/logout", auth, authController.logout);

router.put("/forget-password", authController.forgetPassword);
router.put("/reset-password", authController.resetPassword);

router.post("/add-item", serviceItemController.addItem);
router.get("/all-item", serviceItemController.getAllItems);
router.get("/all-item/:id", serviceItemController.getItem);
router.put("/all-item/:id", serviceItemController.updateItem);
router.delete("/all-item/:id", serviceItemController.deleteItem);

router.post("/add-package", packageController.addPackage);
router.get("/all-packages", packageController.getAllPackages);
router.get("/all-packages/:id", packageController.getOnePackage);
router.put("/all-packages/:id", packageController.updateOnePackage);
router.delete("/all-packages/:id", packageController.deleteOnePackage);

router.post("/add-locality", localitiesController.addLocality);
router.get("/all-localities", localitiesController.getAllLocalities);
router.get("/all-localities/:id", localitiesController.getOneLocality);
router.put("/all-localities/:id", localitiesController.updateOneLocality);
router.delete("/all-localities/:id", localitiesController.deleteLocality);

router.post("/add-customer", customerController.addNewCustomer);
router.get("/all-customer", customerController.getAllCustomers);
router.get("/customer-cars/:id", customerController.getOneCustomerCars);
router.get("/customer-address/:id", customerController.getOneCustomerAddress);
router.put("/update-customer/:id", customerController.updateCustomerDetails);
router.get("/customer-details/:id", customerController.getOneCustomerDetails);

router.post("/add-order", orderController.createOrder);
router.get("/all-orders", orderController.getAllOrders);
router.get("/all-order/:id", orderController.getOneOrderDetails);
router.put("/update-order/:id", orderController.updateOrder);
router.get("/get-subscriptions", orderController.getSubscriptions);

router.get("/ordertypesearch", searchController.orderType);

router.get("/getalluser", getAlluserController.get);
router.get("/getuser/:id", getAlluserController.getone);
router.put("/getuser/:id", getAlluserController.update);
router.delete("/getuser/:id", getAlluserController.destroy);

router.get("/allcars", CarController.getAllCars);

module.exports = router;
