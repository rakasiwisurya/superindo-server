const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middlewares/auth");
const { upload } = require("../middlewares/file");
const {
  register,
  registerAdmin,
  login,
  loginAdmin,
  getUserTransaction,
  getUserTransactions,
} = require("../controllers/user");
const {
  addProductCategory,
  getProductCategories,
  getProductCategory,
  updateProductCategory,
  nonactiveProductCategory,
} = require("../controllers/productCategory");
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  nonactiveProduct,
} = require("../controllers/product");
const {
  addProductVariant,
  getProductVariants,
  getProductVariant,
  updateProductVariant,
  nonactiveProductVariant,
} = require("../controllers/productVariant");
const {
  addTransaction,
  getTransactions,
  getTransactionDetails,
} = require("../controllers/transaction");
const { getDashboard } = require("../controllers/dashboard");

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/login-admin", loginAdmin);

router.post("/product-categories", auth, adminOnly, addProductCategory);
router.get("/product-categories", auth, adminOnly, getProductCategories);
router.get("/product-categories/:id", auth, adminOnly, getProductCategory);
router.put("/product-categories/:id", auth, adminOnly, updateProductCategory);
router.delete("/product-categories/:id", auth, adminOnly, nonactiveProductCategory);

router.post("/products", auth, adminOnly, addProduct);
router.get("/products", auth, adminOnly, getProducts);
router.get("/products/:id", auth, adminOnly, getProduct);
router.put("/products/:id", auth, adminOnly, updateProduct);
router.delete("/products/:id", auth, adminOnly, nonactiveProduct);

router.post(
  "/product-variants",
  auth,
  adminOnly,
  upload("image_location", process.env.UPLOAD_PATH),
  addProductVariant
);
router.get("/product-variants", getProductVariants);
router.get("/product-variants/:id", getProductVariant);
router.put(
  "/product-variants/:id",
  auth,
  adminOnly,
  upload("image_location", process.env.UPLOAD_PATH),
  updateProductVariant
);
router.delete("/product-variants/:id", auth, adminOnly, nonactiveProductVariant);

router.post("/transactions", auth, addTransaction);
router.get("/transactions", auth, adminOnly, getTransactions);
router.get("/transaction-details", auth, adminOnly, getTransactionDetails);

router.get("/users/transactions", auth, getUserTransactions);
router.get("/users/transactions/:id", auth, getUserTransaction);

router.get("/dashboard", auth, adminOnly, getDashboard);

module.exports = router;
