const { body } = require("express-validator");

const validateRegistration = [
  body("email", "valid email is required").notEmpty().isEmail(),
  body("password", "password is required").notEmpty(),
  body(
    "password",
    "password length min is 8 and max is 50 characters"
  ).isLength({ min: 8, max: 50 }),
];

const validateLogin = [
  body("email", "valid email is required").notEmpty().isEmail(),
  body("password", "password is required").notEmpty(),
];

module.exports = {
  validateRegistration,
  validateLogin,
};
