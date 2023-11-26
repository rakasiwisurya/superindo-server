const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middlewares/auth");
const { upload } = require("../middlewares/file");
const { register, registerAdmin, login } = require("../controllers/user");
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
const { addTransaction, getTransactions } = require("../controllers/transaction");

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

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

module.exports = router;
