const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUsers,
  getUserById,
  
} = require("../controllers/userController");
const {
  createProduct,
  getProducts,
  updateProducts,
} = require("../controllers/productController");
const {
  createBill,
  getBills,
  getBillByVendorId,
  getBillByBillId,
  getBillItemsByBillId,
} = require("../controllers/billController");
const { authentication } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/user", authentication, getUsers);
router.get("/user/:userId", authentication, getUserById);
//get vendor by vendor id params

router.post("/productss",authentication, createProduct);
router.get("/products", authentication, getProducts);
router.put("/products/:productId", authentication, updateProducts);
//delete 

router.post("/bill", authentication, createBill);
router.get("/bill/getBills", authentication, getBills);
router.get("/bill/vendor/:userId", authentication, getBillByVendorId); 
router.get("/bill/:billId", authentication, getBillByBillId);

router.get("/billItem/:billId", authentication, getBillItemsByBillId);

//get bill by vendor params?
//by bill id
//getbillitemsby bill id
//delete

module.exports = router; 
