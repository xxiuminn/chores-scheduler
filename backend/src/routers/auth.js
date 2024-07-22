const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth");
const { validateLogin, validateRegistration } = require("../validators/auth");
const checkErrors = require("../validators/checkErrors");

router.put("/register", validateRegistration, checkErrors, register);
router.post("/login", validateLogin, checkErrors, login);

module.exports = router;
