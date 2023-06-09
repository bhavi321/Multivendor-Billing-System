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
  getProductByProductId,
  updateProducts,
  deleteProduct
} = require("../controllers/productController");
const {
  createBill,
  getBills,
  getBillByVendorId,
  getBillByBillId,
  getBillItemsByBillId,
} = require("../controllers/billController");
const { authentication } = require("../middlewares/auth");

router.post("/api/register", register);
router.post("/api/login", login);
router.get("/api/user", authentication, getUsers);
router.get("/api/user/:userId", authentication, getUserById);


router.post("/api/productss", authentication, createProduct);
router.get("/api/products", authentication, getProducts);
router.get("/api/products/id/:productId", authentication, getProductByProductId);
router.put("/api/products/update/:productId", authentication, updateProducts);
router.put("/api/products/delete/:productId", authentication, deleteProduct);


router.post("/api/bill", authentication, createBill);
router.get("/api/bill/getBills", authentication, getBills);
router.get("/api/bill/vendor/:userId", authentication, getBillByVendorId);
router.get("/api/bill/:billId", authentication, getBillByBillId);


router.get("/api/billItem/:billId", authentication, getBillItemsByBillId);



module.exports = router;
