const express = require("express");
const router = express.Router();
const { getUsers, seedUsers, register, login } = require("../controllers/auth");
const { validateLogin, validateRegistration } = require("../validators/auth");
const checkErrors = require("../validators/checkErrors");

router.get("/users", getUsers);
router.post("/seed", seedUsers);
router.post("/user/register", validateRegistration, checkErrors, register);
router.post("/user/login", validateLogin, checkErrors, login);

module.exports = router;
