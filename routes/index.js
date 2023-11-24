const express = require("express");
const router = express.Router();
const { register, registerAdmin, registerOperator, login } = require("../controllers/user");

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/register-operator", registerOperator);
router.post("/login", login);

module.exports = router;
